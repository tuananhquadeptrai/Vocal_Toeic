# Design System Basics

## Theme Direction

- Tone: warm study workspace
- Visual style: soft cards, rounded controls, earthy accent
- Primary use case: fast daily study on desktop and mobile

## Core Tokens

Defined in [globals.css](E:\Quizzz\src\app\globals.css):

- `--background`
- `--foreground`
- `--card`
- `--primary`
- `--secondary`
- `--muted`
- `--accent`
- `--destructive`
- `--success`
- `--warning`
- `--border`
- `--input`
- `--ring`
- `--radius`

## Typography

- Display and headings: `Space Grotesk`
- Utility and mono text: `IBM Plex Mono`

## Primitive Components

Base UI lives in [src/components/ui](E:\Quizzz\src\components\ui):

- `Button`
- `Badge`
- `Card`
- `Input`
- `Textarea`
- `Label`
- `Select`
- `Separator`

## Button Variants

- `default`: primary call to action
- `secondary`: secondary CTA
- `outline`: neutral action
- `ghost`: inline or low emphasis action
- `destructive`: destructive action
- `success`: positive system action
- `warning`: caution state

## Badge Variants

- `default`
- `outline`
- `accent`
- `success`
- `warning`
- `danger`

## Layout Rules

- Use `AppShell` for page framing
- Use `SectionCard` for content blocks
- Use `PageHeader` for page intro
- Keep action groups in a single horizontal row when possible
- Prefer semantic colors over hard-coded utility colors in feature code

## Form Rules

- Use `Label + Input`
- Use `Label + Textarea`
- Use `Select` instead of native select for main filters and settings
- Show validation text in `text-destructive`

## Status Rules

- New or highlighted content: `accent`
- Healthy or correct state: `success`
- Review-needed state: `warning`
- Error or destructive state: `danger` or `destructive`
