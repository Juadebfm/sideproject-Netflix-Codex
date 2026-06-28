# Accessibility Baseline

## Product Expectations

- Mobile-first does not reduce accessibility requirements.
- Core discovery, copy, and open flows must work with keyboard and assistive technology.

## UI Requirements

- Use semantic landmarks, headings, buttons, lists, dialogs, and form controls.
- Maintain visible focus states on all interactive elements.
- Ensure touch targets are at least `44x44px`.
- Meet WCAG AA contrast for text and key controls.
- Do not rely on color alone for status such as availability or recommendation confidence.

## Interaction Requirements

- Search suggestions and filter chips must have predictable focus order.
- Copy success and error feedback must be announced clearly.
- Reduced-motion preference must disable non-essential motion.
- Empty, loading, and error states must still explain next steps.

## Current Gaps

- TODO: define screen-reader copy-feedback pattern during implementation
- TODO: define dialog/drawer focus trap conventions once component library exists
