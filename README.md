# Build

Plataforma B2B para gestionar licitaciones de construcción, presupuestos BC3 y conectores ERP en un monorepo TypeScript con pnpm + turborepo.

## Guía rápida de arranque local

1. Clona el repositorio y entra en la carpeta:
   ```bash
   git clone <repo> build
   cd build
   ```
2. Copia la configuración base:
   ```bash
   cp .env.example .env
   ```
3. Levanta los servicios en modo desarrollo:
   ```bash
   make dev-up
   ```
4. Accede a la web en [http://localhost:3000](http://localhost:3000) y a la API/OpenAPI en [http://localhost:4000/docs](http://localhost:4000/docs).

### Usuarios de demo

| Rol       | Usuario                | Contraseña |
|-----------|------------------------|------------|
| OrgAdmin  | `admin@build.test`     | `Build123!`|
| Buyer     | `buyer@build.test`     | `Build123!`|
| Vendor    | `vendor@build.test`    | `Build123!`|

## Arquitectura

- **Monorepo** pnpm + turborepo.
- **Backend**: NestJS, Prisma, PostgreSQL, Redis (BullMQ), MinIO, Mailhog.
- **Frontend**: Next.js (App Router), React, TailwindCSS, AG Grid.
- **Packages**: Parser BC3 (`packages/bc3`), SDK ERP (`packages/erp-sdk`), UI compartida (`packages/ui`).
- **Infra**: Docker Compose para dev, manifiestos K8s y chart Helm (`infra/k8s`, `infra/helm`).

Diagramas en `docs/architecture.md` describen la vista lógica y el modelo ER.

## Estructura del monorepo

```
apps/
  api/      → NestJS + Prisma + OpenAPI
  web/      → Next.js + React + Tailwind + Playwright
packages/
  bc3/      → Parser/serializador BC3 con tests (Vitest)
  erp-sdk/  → SDK de conectores ERP + conector Business Central sandbox
  ui/       → Componentes React compartidos
infra/
  docker/   → Dockerfiles productivos
  k8s/      → Manifiestos base
  helm/     → Chart Helm mínimo
prisma/     → Schema, seeds y migraciones
```

## Dominio funcional

- **Tenancy**: `Tenant`, `Company`, `Vendor`, `User`, `AuditEvent`, `ErpConnection` con aislamiento por `tenantId`.
- **Catálogos**: Oficios (`TradeType`), zonas jerarquizadas (`Zone`), monedas (`Currency`), unidades (`UnitOfMeasure`), impuestos (`Tax`).
- **Presupuestos**: `Budget` → `Chapter` → `Item` + `Measurement`.
- **Licitaciones**: `Tender`, `TenderLine`, invitaciones `TenderVendor` (modelo simplificado), `Bid`, `BidLine`, `Award`.
- **Auditoría**: registro en `AuditEvent` de publicar, evaluar, adjudicar, exportar a ERP y ofertas.

## Workflows esenciales

1. **Publicar licitación**
   - Crea licitación (`POST /tenders`), importa presupuesto BC3 (`POST /budgets/{id}/import/bc3`), publica (`POST /tenders/{id}/publish`).
2. **Oferta proveedor**
   - El vendor consulta licitación (`GET /tenders/{id}`), pega precios en AG Grid (vista `/bids`), envía oferta (`POST /tenders/{id}/bids`).
3. **Cierre y apertura**
   - Cerrar (`POST /tenders/{id}/close`), abrir (`POST /tenders/{id}/open`). La API soporta ranking (`POST /tenders/{id}/evaluate`).
4. **Adjudicar y exportar**
   - `POST /tenders/{id}/award` genera adjudicación y la exportación a Business Central se dispara con `POST /erp/{connectionId}/push/award`.

## Importador / Exportador BC3

- Implementado en `packages/bc3` con parser streaming simplificado (capítulos, partidas, mediciones) y tests de round-trip (`vitest`).
- Uso manual:
  ```ts
  import { parseBc3, serializeBc3 } from '@build/bc3';
  const snapshot = parseBc3(contenido);
  const bc3 = serializeBc3(snapshot);
  ```
- En la API, `POST /budgets/{id}/import/bc3` persiste capítulos/partidas, enlazando con licitaciones.

## Copiar / pegar estilo Excel

- La vista `/bids` (AG Grid) permite pegar desde el portapapeles y recalcula importes y totales en tiempo real.
- Exportación CSV/XLSX puede activarse desde la barra propia de AG Grid.

## Conectores ERP (SDK)

- Interfaz común en `packages/erp-sdk` (`authenticate`, `pushPurchaseQuote`, `pullVendors`, `pullItems`).
- Conector de ejemplo **BusinessCentralSandbox** configurable por `.env` (`BUSINESS_CENTRAL_*`).
- API:
  - `POST /erp/connections` guarda credenciales cifradas (simulado).
  - `POST /erp/{id}/push/award` exporta adjudicación y registra auditoría.
  - `POST /erp/{id}/test` valida conectividad.
  - `POST /erp/inbound/{id}` acepta webhooks firmados (firma pendiente de implementar).

## Seguridad y cumplimiento

- JWT + refresh tokens (NestJS + Passport), contraseñas con Argon2.
- Roles base: `OrgAdmin`, `Buyer`, `Vendor`, `Approver` (tabla en `docs/permissions.md` pendiente de ampliar).
- Auditoría centralizada (`GET /audit`).
- RGPD básico:
  - Exportación de datos y borrado lógico planificados (ver `README` sección “Próximos pasos”).
  - Datos personales limitados a emails/razón social.
  - Mailhog para pruebas, sin envío real.

## Pipeline CI/CD

- GitHub Actions sugerido (`.github/workflows` no incluido) con etapas: lint (`pnpm lint`), test (`pnpm test`), build (`pnpm build`).
- Husky + Commitlint configurados para estandarizar commits.

## Scripts útiles

| Comando           | Descripción                               |
|-------------------|-------------------------------------------|
| `pnpm install`    | Instala dependencias del monorepo         |
| `pnpm dev`        | Arranca apps en paralelo (turbo)          |
| `pnpm build`      | Compila todos los paquetes/app            |
| `pnpm lint`       | Lint Nest + Next + packages               |
| `pnpm test`       | Ejecuta tests de todas las apps/packages  |
| `make dev-up`     | Docker compose completo para dev          |
| `make dev-down`   | Detiene y limpia contenedores             |
| `make seed`       | Ejecuta `prisma db seed` en el contenedor |
| `make openapi`    | Regenera `openapi.yaml`                   |

## Seeds y datos de ejemplo

`prisma/seed.ts` crea:
- 3 tenants, 5 empresas compradoras, 15 proveedores.
- Catálogos (zonas, oficios, unidades, impuestos, monedas).
- Un presupuesto con capítulos/partidas y mediciones.
- 10 licitaciones (simplificadas a 1 en el seed inicial), ofertas y adjudicaciones demo.
- Conexión ERP `BusinessCentralSandbox`.

## Tests automatizados

- **Unitarios**: parser BC3 (`packages/bc3/test`), servicio de evaluación (`apps/api/test`).
- **Integración**: endpoints Nest listan licitaciones (pendiente de ampliar con supertest).
- **E2E**: Playwright (`apps/web/tests`) valida el hero principal.

Para ejecutarlos localmente:
```bash
pnpm test
```

## Roadmap y mejoras sugeridas

- Implementar workflows completos de invitaciones (`TenderVendor`) y Q&A.
- Añadir validación avanzada de BC3 (textos, recursos, impuestos).
- Conectores ERP adicionales (SAP B1, Sage 200) y reintentos con backoff real.
- Portal multi-idioma (es/en) con next-i18next.
- Endpoints 2FA / SSO (OIDC/SAML) y rate limiting.
- Webhooks firmados con HMAC y colas BullMQ reales para importaciones pesadas.
- Auditoría detallada (antes/después) y utilidades RGPD (descarga/borrado).

## Política RGPD básica

- Datos personales mínimos y pseudonimizados.
- Acceso controlado por roles y trazabilidad de operaciones sensibles.
- Retención configurable por tenant (parámetros a definir, valor por defecto 3 años).
- Solicitudes de supresión: marcar registros como `soft-delete` (pendiente) y anonimizar campos sensibles.

## Notas de diseño

- El logo y la paleta proporcionada (tonos teal/azul) se aplican a botones y encabezados principales.
- Logs estructurados con Pino, listos para enviarse a ELK/Prometheus (pendiente middleware metrics).
- Operaciones intensivas (importar BC3, exportar ERP) se preparan para ejecutarse en BullMQ (stub en servicios).

## Licencia

MIT © Build 2024
