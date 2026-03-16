---
date: "2026-03-01"
title: "회원가입 구현 1탄 (공통 input 컴포넌트 제작) (작성중)"
categories: ["React"]
summary: "공통 input 컴포넌트를 만들어보자."
thumbnail: "/thumbnail/리액트.png"
---

```tsx
import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef, useId } from 'react'
import EmailInput from '@/src/common/components/input/email/EmailInput'
import OtpInput from '@/src/common/components/input/otpInput/OtpInput'
import PasswordInput from '@/src/common/components/input/password/PasswordInput'
import type { InputProps, StatusType } from '@/src/common/components/input/types'
import ValidationContainer from '@/src/common/components/input/ValidationContainer'
import FloatingLabel from '@/src/common/components/label/FloatingLabel'
import { cn } from '@/src/common/utils/twMerge'
import Input from '.'

type FloatingInputProps = {
  status?: StatusType
  suffix?: ReactNode
  message?: ReactNode
  label?: string
} & InputProps

function FloatingInput({ message, ...props }: FloatingInputProps, ref: ForwardedRef<HTMLInputElement>) {
  const { id, label, status, variant } = props
  const inputId = useId()
  const placeholder = status === 'error' && label ? label : ' '
  const hasWidthClass = props.className?.split(/\s+/).some((cls) => cls.startsWith('w-')) ?? false

  const renderInput = () => {
    switch (variant) {
      case 'email':
        return <EmailInput ref={ref} id={inputId} placeholder={placeholder} {...props} />
      case 'password':
        return <PasswordInput ref={ref} id={inputId} placeholder={placeholder} {...props} />
      case 'otp':
        return <OtpInput id={inputId} placeholder={placeholder} {...props} />
      case 'text':
        return <Input ref={ref} id={inputId} placeholder={placeholder} {...props} />
      default: {
        throw new Error(`Unhandled variant: ${variant satisfies never}`)
      }
    }
  }

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className={cn('relative group', !hasWidthClass ? 'w-full' : '', props.className)}>
        {renderInput()}
        {label && <FloatingLabel htmlFor={id} label={label} status={status} />}
      </div>
      {message && <ValidationContainer>{message}</ValidationContainer>}
    </div>
  )
}

export default forwardRef<HTMLInputElement, FloatingInputProps>(FloatingInput)

```

```tsx
import type { ComponentPropsWithoutRef } from 'react'
import FieldSetOutline from '@/src/common/components/input/FieldSetOutline'
import type { StatusType } from '@/src/common/components/input/types'
import Label from '@/src/common/components/label'
import { cn } from '@/src/common/utils/twMerge'

interface FloatingLabelProps extends ComponentPropsWithoutRef<typeof Label> {
  status?: StatusType
  label: string
}

export default function FloatingLabel({ htmlFor, status, label, ...props }: FloatingLabelProps) {
  return (
    <>
      <Label
        className={cn(`absolute left-[9px] top-px text-[13px] px-1 font-normal pointer-events-none
        transition-[top,transform,font-size] duration-300 transform -translate-y-1/2  
        peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base 
        peer-focus:top-px peer-focus:text-[13px] peer-focus:text-grey-02 
        peer-disabled:text-grey-02 peer-disabled:opacity-100
        peer-data-[error=true]:top-px peer-data-[error=true]:text-[13px]

        text-grey-05
        peer-data-[error=true]:text-sub-red-01
        peer-data-[success=true]:text-blue-01
        
        max-w-[calc(100%-16px)] truncate
        
        `)}
        htmlFor={htmlFor}
        {...props}
      >
        {label}
      </Label>

      <FieldSetOutline label={label} status={status} />
    </>
  )
}

```

```tsx
import { cva } from 'class-variance-authority'
import type { StatusType } from './types'

const fieldsetVariants = cva('inset-0 absolute border rounded-[8px] pointer-events-none mt-[-9px] ', {
  variants: {
    state: {
      placeholder: 'invisible peer-placeholder-shown:visible',
      filled: 'visible peer-placeholder-shown:invisible',
    },
    border: {
      error: 'border-sub-red-01 group-focus-within:border-sub-red-01!',
      success: 'border-blue-01 group-focus-within:border-blue-01!',
      default: 'border-bright-01 group-focus-within:border-bright-01!',
    },
  },
  defaultVariants: {
    state: 'placeholder',
    border: 'default',
  },
})

const legendVariants = cva('ml-2 text-[13px] transition-all invisible whitespace-nowrap', {
  variants: {
    state: {
      placeholder: 'px-0 max-w-[0.01px] group-focus-within:max-w-full group-focus-within:px-1',
      filled: 'px-1 max-w-full truncate',
    },
    error: {
      true: 'max-w-full px-1',
      false: '',
    },
  },
  defaultVariants: {
    state: 'placeholder',
    error: false,
  },
})
interface FieldSetOutlineProps {
  label: string
  status?: StatusType
}

export default function FieldSetOutline({ label, status }: FieldSetOutlineProps) {
  const borderVariant = status ?? 'default'
  return (
    <>
      <fieldset className={fieldsetVariants({ state: 'placeholder', border: borderVariant })}>
        <legend className={legendVariants({ state: 'placeholder', error: status === 'error' })}>{label}</legend>
      </fieldset>

      <fieldset className={fieldsetVariants({ state: 'filled', border: borderVariant })}>
        <legend className={legendVariants({ state: 'filled', error: status === 'error' })}>{label}</legend>
      </fieldset>
    </>
  )
}

```

```ts

export type OTPInputType = Omit<ComponentProps<typeof OTPInput>, 'children'>

export interface EmailInput extends InputHTMLAttributes<HTMLInputElement> {
  variant: 'email'
}

interface PasswordInput extends InputHTMLAttributes<HTMLInputElement> {
  variant: 'password'
}

export interface TextInput extends InputHTMLAttributes<HTMLInputElement> {
  variant: 'text'
}

export type OtpInput = OTPInputType & {
  maxLength: number
  variant: 'otp'
}

export type InputProps = EmailInput | PasswordInput | OtpInput | TextInput

```


```tsx
import type { ComponentProps, ForwardedRef } from 'react'
import { forwardRef } from 'react'
import type { StatusType } from '@/src/common/components/input/types'
import { cn } from '@/src/common/utils/twMerge'

interface InputProps extends ComponentProps<'input'> {
  status?: StatusType
}

function Input({ className, status, type, ...props }: InputProps, ref: ForwardedRef<HTMLInputElement>) {
  return (
    <input
      type={type}
      data-slot="input"
      ref={ref}
      aria-invalid={status === 'error'}
      data-error={status === 'error' ? 'true' : undefined}
      data-success={status === 'success' ? 'true' : undefined}
      className={cn(
        `flex h-13 w-full rounded-[8px] p-4 outline-none bg-mono-04
        overflow-hidden whitespace-nowrap
        text-mono-01 text-base placeholder:text-muted-foreground 
        disabled:cursor-not-allowed disabled:bg-bright-05 disabled:opacity-100 disabled:text-mono-03
        peer border-0`,
        status === 'error'
          ? 'data-[error=true]:placeholder:text-grey-05 data-[error=true]:focus:placeholder:opacity-0'
          : '',
        className,
      )}
      {...props}
    />
  )
}

export default forwardRef<HTMLInputElement, InputProps>(Input)

```

<details>

<summary>참고문헌</summary>

<div markdown="1">

https://velog.io/@juhyeon1114/AWS-S3%EC%99%80-Cloudfront%EB%A1%9C-%EC%9B%B9%EC%82%AC%EC%9D%B4%ED%8A%B8-%EB%B0%B0%ED%8F%AC

</div>

</details>
