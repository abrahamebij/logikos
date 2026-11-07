# Logikos

A free, open-source desktop app for presenting church services, with an AI assistant that follows the pastor's message and prepares what belongs on screen.

**Status:** In design · MVP in planning
**Author:** Abraham Ebijuni · October 24, 2026

## Overview

Logikos offers an Easyworship-style experience with an AI model built in. It streams the pastor's message, picks out the content that belongs on screen, and shows it in a window where the operator decides what goes up on the main display.

## UI Design (In Progress)

The interface is being designed in Figma. Follow the ongoing work in the [Logikos UI design file](https://www.figma.com/design/4XFalm8Ps0TxFdfLYC0Dj7/Logikos?t=bMfYyFaOBWmbfoLA-1).

## The Problem

Running the screens during a service is a demanding live job. The operator has to follow the pastor, find the right scripture or lyric, and display it at the right moment, all without delay. Existing tools like Easyworship rely entirely on manual control. AI-assisted alternatives such as Loghema AI exist, but they are paid and closed, which puts them out of reach for many smaller churches.

## The Vision

A presentation tool that feels familiar to anyone who has used Easyworship, but where the AI does the following along, so the operator can focus on oversight rather than constant button-pressing. It will be free for everyone, and its source code will be open for anyone to use, improve and adapt.

## Who It Is For

- **Operators and media teams** who run the screens during services
- **Small and growing churches** that cannot afford paid AI tools
- **Contributors** who want to help build and improve an open tool for the church community

## MVP

The first release focuses on the core experience:

- **Easyworship-like interface:** similar in feel and workflow, but not a copy
- **Message following:** streams the pastor's message live and prepares relevant content, such as a scripture being read or referenced
- **Operator control window:** the operator reviews what the AI prepared and decides what goes on the main display

## Future Implementation

These features are planned for after the MVP and are **not** part of the first release:

- **Auto-fly:** lets the AI run on its own, putting content on screen without the operator doing it manually
- **Song import and follow-along:** import songs, and the app follows along as they are sung or spoken
- **Slide presentations with spoken keywords:** move between slides simply by saying a keyword

## Principles

- **Free:** no cost to churches, ever
- **Open-source:** transparent and community-driven
- **Operator in control:** the AI assists, but the operator can always step in or switch back to manual
- **Familiar:** easy to pick up for anyone already used to church presentation software

## Roadmap

1. **MVP:** a working presentation tool with manual control, plus live message following that suggests content for the operator to approve
2. **Post-MVP:** auto-fly, song import and follow-along, and keyword-driven slides

## Risks and Considerations

- **Accuracy:** a wrong verse on screen in front of a congregation is costly, so operator override and approval must always be easy
- **Live audio quality:** noisy rooms make speech harder to follow, and sung lyrics will be harder still when song follow-along arrives
- **Bible translation licensing:** only freely usable translations can be included by default; others will need to be added by users
- **Scope:** this is a personal project, so the feature set needs to grow in stages

## Success Looks Like

A church operator can run a full service with Logikos, trusting it to keep up with the pastor, and stepping in only when they want to.
