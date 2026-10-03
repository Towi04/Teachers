# AGENTS.md

## Project Overview

This repository is for **MyOwnMaterials**, a freemium web platform that helps teachers create classroom-ready teaching materials from their own content.

The initial product focus is printable materials. Digital activities, H5P integration, live class sessions, and student join codes are planned for later phases, but should not drive the first implementation decisions.

## Product Vision

MyOwnMaterials should let teachers create content once and transform it into multiple attractive classroom materials.

Core concept:

> Add your content. Choose an activity. Pick a template. Download and teach.

The platform should eventually support any school subject or language. The first target audience is teachers who need printable classroom materials, especially language teachers working with preschool, elementary, and middle school students.

## Initial Scope

Prioritize these printable-material features first:

- Vocabulary sets
- Image uploads
- Reusable image and vocabulary asset library
- Flashcards
- Printable PDF exports
- Basic worksheet templates
- Watermarked free downloads
- Private/public material visibility
- Credits earned from valid public contributions

Do not prioritize these yet:

- H5P authoring
- Moodle integration
- Live multiplayer activities
- Student join codes
- Real-time quizzes
- LMS-grade reporting

These belong to a later digital-content phase.

## Content Model

The product should be built around reusable teacher content:

- Words and phrases
- Definitions
- Example sentences
- Images
- Reading texts
- Questions and answers
- Instructions
- Tags, subject, grade level, and language

Activities should be generated from this content instead of being stored as isolated one-off documents whenever possible.

Example:

1. A teacher creates a vocabulary set.
2. The same set can generate flashcards, matching worksheets, word searches, bingo cards, and other activities.
3. Later, the same content model can power online activities.

## Public vs Private Content

Content should be private by default.

Teachers may create private materials with uploaded images under their own responsibility. Private content:

- Is only available to the creator.
- Does not appear in public search.
- Cannot be downloaded by other users.
- Does not earn contribution credits.

Public content must be copyright-safe. Public content:

- Must use original, licensed, public-domain, Creative Commons, platform-approved, or otherwise reusable assets.
- Can appear in the public resource library.
- Can earn credits when published or downloaded.
- Can be reported and removed if it violates copyright, trademark, or platform rules.

Do not design the product in a way that rewards users for publicly sharing copyrighted characters, trademarks, or third-party assets without permission.

## Copyright and User Responsibility

The platform may allow users to upload images, but the product should make responsibility clear:

- Users are responsible for the content they upload.
- Users must confirm they own or have permission to use assets before making content public.
- Public resources should include report/removal workflows.
- Reusable shared assets should carry license metadata.

Avoid building features that scrape images from the web or imply that third-party copyrighted images are safe to reuse.

## Shared Asset Library

When teachers create materials with common words, the platform should reduce duplicated work.

For example, if a teacher adds the word `run`, the product can show reusable images already approved for `run`.

Shared assets should support states such as:

- Private
- Public reusable
- Pending review
- Platform approved
- Removed

This helps teachers work faster and reduces duplicate image storage.

## Freemium Model

Suggested plan structure:

### Guest

- Browse public materials.
- Download limited public resources, if enabled.
- Cannot save original content.

### Free Teacher

- Create printable materials.
- Save a limited content library.
- Download with watermark.
- Earn credits by publishing copyright-safe public materials.
- Use credits to download public resources or access limited premium actions.

### Premium Teacher

- Remove watermark.
- Add school logo.
- Create more or unlimited materials.
- Download more or unlimited public resources.
- Access premium templates.
- Use AI-assisted image, text, question, or worksheet generation when implemented.

### School Plan

Potential future plan:

- Multiple teacher accounts.
- Shared school library.
- School branding.
- Admin controls.
- Group-level reporting once digital activities exist.

## Design Principles

- User-facing copy should start in English.
- Keep the interface simple for busy teachers.
- Teachers should not need design skills to create attractive materials.
- Prefer guided flows over blank-canvas editors for the MVP.
- Make printable outputs classroom-ready.
- Separate content creation from activity/template selection.
- Build in phases; avoid implementing digital systems before the printable foundation is strong.

## Recommended User Flow

1. Teacher creates an account or enters as a guest.
2. Teacher creates a vocabulary set or content collection.
3. Teacher adds words, images, definitions, and examples.
4. Teacher chooses an activity type, starting with flashcards.
5. Teacher chooses a template.
6. Teacher previews the output.
7. Teacher downloads a PDF.
8. Free downloads include a watermark; premium downloads can include school branding.

## Future Digital Phase

After printable materials are stable, the platform can add digital activities.

Possible later features:

- Online quiz mode
- Student join codes
- Teacher live sessions
- Self-paced student activities
- H5P content playback
- H5P import/export
- H5P authoring without Moodle
- Activity results and analytics

H5P can be integrated later as an advanced interactive activity engine, but the platform should own the MyOwnMaterials content library, public/private rules, credits, templates, and user experience.

## Development Guidance

- Keep early implementation decisions aligned with printable materials first.
- Do not overfit the data model to flashcards only.
- Treat vocabulary/content collections as the foundation.
- Preserve a clean path for future online activities.
- Avoid adding dependencies or systems for H5P until the printable MVP requires them or the project explicitly moves into the digital phase.
- Keep legal/copyright boundaries visible in product flows involving uploads and public publishing.
