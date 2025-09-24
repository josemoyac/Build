import { describe, expect, it } from 'vitest';
import { PrimaryButton } from '../src/primary-button.js';

describe('PrimaryButton', () => {
  it('composes className', () => {
    const element = PrimaryButton({ className: 'extra', children: 'Enviar' } as any);
    expect(element.props.className).toContain('extra');
  });
});
