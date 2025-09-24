export interface MeasurementSnapshot {
  description: string;
  quantity: number;
}

export interface ItemSnapshot {
  code: string;
  name: string;
  unit: string;
  quantity: number;
  price: number;
  measurements?: MeasurementSnapshot[];
}

export interface ChapterSnapshot {
  code: string;
  name: string;
  items: ItemSnapshot[];
}

export interface BudgetSnapshot {
  reference: string;
  currency: string;
  chapters: ChapterSnapshot[];
}

const FIELD_SEPARATOR = '|';

export function parseBc3(content: string): BudgetSnapshot {
  const lines = content.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const chapters: ChapterSnapshot[] = [];
  let currentChapter: ChapterSnapshot | undefined;
  let currentItem: ItemSnapshot | undefined;
  let reference = 'BUDGET';
  let currency = 'EUR';

  for (const line of lines) {
    const [type, ...fields] = line.split(FIELD_SEPARATOR).map((value) => value.trim());
    switch (type) {
      case 'H': {
        reference = fields[0] ?? reference;
        currency = fields[1] ?? currency;
        break;
      }
      case 'C': {
        currentChapter = {
          code: fields[0] ?? '',
          name: fields[1] ?? '',
          items: []
        };
        chapters.push(currentChapter);
        currentItem = undefined;
        break;
      }
      case 'D': {
        if (!currentChapter) {
          throw new Error('Partida sin capítulo');
        }
        currentItem = {
          code: fields[0] ?? '',
          name: fields[1] ?? '',
          unit: fields[2] ?? 'ud',
          quantity: Number.parseFloat(fields[3] ?? '0'),
          price: Number.parseFloat(fields[4] ?? '0'),
          measurements: []
        };
        currentChapter.items.push(currentItem);
        break;
      }
      case 'M': {
        if (!currentItem) {
          throw new Error('Medición sin partida');
        }
        currentItem.measurements?.push({
          description: fields[0] ?? '',
          quantity: Number.parseFloat(fields[1] ?? '0')
        });
        break;
      }
      default:
        break;
    }
  }

  return { reference, currency, chapters };
}

export function serializeBc3(snapshot: BudgetSnapshot): string {
  const lines: string[] = [];
  lines.push(['H', snapshot.reference, snapshot.currency].join(FIELD_SEPARATOR));
  for (const chapter of snapshot.chapters) {
    lines.push(['C', chapter.code, chapter.name].join(FIELD_SEPARATOR));
    for (const item of chapter.items) {
      lines.push(
        [
          'D',
          item.code,
          item.name,
          item.unit,
          item.quantity.toString(),
          item.price.toString()
        ].join(FIELD_SEPARATOR)
      );
      for (const measurement of item.measurements ?? []) {
        lines.push(['M', measurement.description, measurement.quantity.toString()].join(FIELD_SEPARATOR));
      }
    }
  }
  return lines.join('\n');
}
