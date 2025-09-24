import React, { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

const palette = {
  primary: '#047481',
  primaryDark: '#034952'
};

export function PrimaryButton({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(
        'rounded-md px-4 py-2 font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        className
      )}
      style={{ backgroundColor: palette.primary }}
      {...props}
    />
  );
}
