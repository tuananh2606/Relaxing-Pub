'use client';
import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '~/lib/utils';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = ({ ...props }: DialogPrimitive.DialogPortalProps) => <DialogPrimitive.DialogPortal {...props} />;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-30 grid cursor-pointer place-items-center overflow-y-auto bg-black/[0.6] backdrop-blur-sm',
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    hideCloseButton?: boolean;
    container?: HTMLElement;
    classNames?: {
      overlay?: string;
      content?: string;
      closeButton?: string;
    };
  }
>(({ className, classNames, children, hideCloseButton, container, ...props }, ref) => (
  <DialogPortal container={container}>
    <DialogOverlay className={cn(classNames?.overlay)}>
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'border-default-100 shadow-medium rounded-xl border bg-[#181818] !p-6 will-change-transform focus:outline-none',
          className ? className : classNames?.content,
        )}
        {...props}
      >
        {children}
        {!hideCloseButton ? (
          <DialogPrimitive.Close
            asChild
            className={cn(
              'focus:ring-primary-200 absolute right-4 top-4 z-20 flex h-5 w-5 items-center justify-center rounded-md opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none',
              classNames?.closeButton,
            )}
          >
            <button aria-label="Close">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 25" fill="none">
                <path
                  d="M12.0007 10.9002L16.9504 5.95044L18.3646 7.36465L13.4149 12.3144L18.3646 17.2641L16.9504 18.6783L12.0007 13.7286L7.05093 18.6783L5.63672 17.2641L10.5865 12.3144L5.63672 7.36465L7.05093 5.95044L12.0007 10.9002Z"
                  fill="white"
                />
              </svg>
              <span className="sr-only">Close</span>
            </button>
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </DialogOverlay>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col gap-y-1.5 text-center sm:text-left', className)} {...props} />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-x-2', className)} {...props} />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn('text-sm text-foreground/60', className)} {...props} />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription };
