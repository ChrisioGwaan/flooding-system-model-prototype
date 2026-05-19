# Melbourne Maribyrnong Area Flood Warning System Demo

A concept prototype for a **Melbourne Maribyrnong Area Flood Warning System**, developed as part of **Interdisciplinary Design for Engineers (ENGR90051_2026_SM1)** at **The University of Melbourne**.

This project demonstrates a household-centred flood warning system for the Maribyrnong River area. It explores how flood risk data, warning logic, backup channels, household devices, and community response layers could work together during a flood event.

> This is a research and design prototype only. It is **not** an operational flood warning system and must not be used for real emergency decisions.

## Project Context

The prototype was created from our team's semester-long research into the **2022 Maribyrnong flood disaster**. At the beginning of the semester, our team investigated what happened during the flood, how warnings were communicated, what kinds of modelling and response systems were being used, and where gaps could exist between official information and household action.

Potential stakeholders for this type of system include:

- Residents in flood-prone areas
- Melbourne Water
- City of Maribyrnong Council
- Victoria State Emergency Service (SES)
- Bureau of Meteorology (BOM)
- Community centres, aged-care providers, carers, and local support networks

Our team also attended university-organised interviews with Maribyrnong City Council. These interviews helped us better understand the 2022 flood event, the systems and models involved at the time, and the importance of the PPRR emergency-management principle: **Prevention, Preparedness, Response, and Recovery**.

## Design Process

The project followed an engineering design process:

1. **Challenge** - Understand the problem of timely, trusted, and actionable flood warning for households.
2. **Divergent Discover** - Research the 2022 Maribyrnong flood, stakeholder needs, existing warning systems, emergency response models, and household-level barriers.
3. **Convergent Define** - Organise research findings into clearer problem areas and define the most important design opportunities.
4. **Divergent Develop** - Generate more than 200 possible ideas and sort them into five critical aspects.
5. **Convergent Deliver** - Select one critical aspect for deeper development using methods such as **How Might We** and **What If It Fails**.
6. **Engineer Outcome** - Build this interactive prototype to test and communicate the proposed system strategy.

The final prototype focuses on one key question: **how can a flood warning chain still deliver a timely, actionable warning when sensors, networks, devices, or central systems fail?**

## Prototype Overview

The demo is a static React-based web prototype. It runs directly in the browser and uses interactive screens to show the proposed flood-warning chain from sensing through to household and community response.

Main screens include:

- **Overview** - Explains the resilient warning chain from river sensing to household alerts.
- **Architecture** - Shows the layered system architecture, including sensors, validation, decision engine, delivery channels, and fallback paths.
- **Map - Maribyrnong** - Displays schematic flood zones, Maribyrnong River corridor, field sensors, risk levels, and household counts.
- **Data Simulation** - Plays through 10 simulated datasets with rainfall, river levels, drainage flow, telecom-assisted sensing, blockage state, and flood risk.
- **Household Device** - Demonstrates possible in-home warning device forms and states such as all clear, prepare, urgent, and connection lost.
- **Resident Alerts** - Shows how different residents receive warnings through device, SMS, app push, and voice calls.
- **Failure Simulation** - Tests scenarios such as sensor failure, network failure, device offline, and central platform failure.
- **Community / Backup** - Presents layered backup strategies including public signage, community wardens, printed action cards, and broadcast fallbacks.

## Key System Ideas

- **Multi-source sensing**: river gauges, rainfall sensors, telecom-tower-assisted sensing, and BOM data.
- **Validation and fusion**: multiple signals are cross-checked before triggering warnings.
- **Zone-based warning**: risk is mapped to flood zones and affected households.
- **Household-centred delivery**: warnings are designed to reach residents through practical, redundant channels.
- **Dedicated in-home device**: a physical warning device acts as a final layer when phones, apps, or power are unreliable.
- **Fail-safe principle**: the system should never silently show "safe" when it cannot verify safety.
- **Layered backup**: digital, physical, human, and printed channels reinforce each other.

## Data and Simulation

The prototype includes simulated datasets and embedded scenario data. These are used to demonstrate system behaviour, not to predict real flood conditions.

Included data files:

- `maribyrnong_flood_datasets_10sheets.xlsx` - spreadsheet containing 10 simulated flood-risk datasets.
- `simulated data_no outlier(Set_1_Normal).csv` - one sample simulated dataset.
- `src/screen-simulation.jsx` - embeds the 10 scenario datasets used by the interactive simulation.

The simulation considers values such as:

- Rolling rainfall
- Upstream and downstream river levels
- Drainage inlet and outlet flow
- Telecom reflective level estimate
- Drainage blockage level
- Overall risk category

## Project Structure

```text
.
├── index.html                         # Browser entry point
├── styles.css                         # Main visual styling
├── tweaks-panel.jsx                   # Prototype tweak/debug controls
├── vercel.json                        # Vercel static hosting configuration
├── maribyrnong_flood_datasets_10sheets.xlsx
├── simulated data_no outlier(Set_1_Normal).csv
├── website prompt.docx
└── src/
    ├── app.jsx                        # App shell, navigation, screen routing
    ├── atoms.jsx                      # Shared UI components
    ├── data.jsx                       # Shared sensors, zones, scenarios, personas
    ├── screen-overview.jsx
    ├── screen-architecture.jsx
    ├── screen-map.jsx
    ├── screen-simulation.jsx
    ├── screen-device.jsx
    ├── screen-alerts.jsx
    ├── screen-failure.jsx
    ├── screen-community.jsx
    └── screen-operator.jsx
```

## Limitations

- This is a course prototype, not a validated emergency-management platform.
- Sensor values, household counts, risk thresholds, and warning outcomes are simulated for demonstration.
- Map polygons and sensor locations are schematic and should not be treated as official flood maps.
- The system architecture is a design proposal created for research communication and prototype testing.
- Real-world deployment would require formal validation, authority integration, cybersecurity assessment, accessibility testing, operations planning, and emergency-service approval.

## Course and Team Note

This demo represents our team's strategy research and proposed solution for **ENGR90051_2026_SM1 Interdisciplinary Design for Engineers** at **The University of Melbourne**. It is intended for readers who want to understand our research direction, design reasoning, and prototype outcome for improving household-level flood warning resilience in the Maribyrnong area.
