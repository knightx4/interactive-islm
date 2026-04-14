# Macro Slides Master Extraction (PDFs)

Generated: 2026-04-13T03:47:31.745Z
Source directory: `/Users/selveyknight/Projects/ISLM/Macro Slides`
Total PDFs discovered: 11
Successful extractions: 11
Failed extractions: 0

## Cursor Analysis Instructions

Use this file to perform a thorough planning and gap analysis:
- Derive a single consolidated requirements map across all PDFs.
- Identify conflicts or inconsistencies between documents.
- Produce a dependency graph (data, model logic, UI controls, outputs).
- Enumerate implementation gaps: missing formulas, undefined variables, unstated assumptions, unclear UX, and unvalidated edge cases.
- Propose a prioritized execution plan (quick wins, core work, validation/testing, and documentation).
- Highlight risks that block implementation and list specific follow-up questions for stakeholders.

## Document index

- 01_measurement_kd.pdf - OK
- 02_productivity_kd.pdf - OK
- 03_saving_kd.pdf - OK
- 04_money_kd.pdf - OK
- 05_unemployment_kd.pdf - OK
- 06_islm_kd.pdf - OK
- 07_supply_kd.pdf - OK
- 08_demand_kd.pdf - OK
- 09_fx_kd.pdf - OK
- 10_open_kd.pdf - OK
- 11_trade_kd.pdf - OK

## Per-document extractions

### 01_measurement_kd.pdf

# Executive Summary

This document is a lecture deck from MGT 425: Macroeconomic Analysis (Topic 1: Measurement) taught by Kevin Donovan at Yale School of Management. It introduces foundational macroeconomic measurement concepts—specifically GDP and inflation—as prerequisites for building the ISLM model used for business cycle analysis and policy evaluation. The course aims to teach MBA students how to interpret macroeconomic events in real time using a simplified but rigorous analytical framework. Key takeaways include:

- GDP can be measured via three equivalent approaches: expenditure, product, and income
- The expenditure approach (Y = C + I + G + X - M) is emphasized throughout the course
- Inflation measurement involves multiple indices (CPI, PPI, GDP Deflator) with known upward biases
- Real vs. nominal GDP distinction is critical for separating price effects from quantity effects
- The course builds toward the ISLM model over 13 weeks, with measurement as the foundation

---

# Purpose and Scope

## Course Objectives
- Build and use the "go to" model for business cycles (ISLM model) used by central banks, IMF, and financial press
- Teach basic macro vocabulary and concepts (e.g., inflation, GDP, interest rates)
- Develop ability to interpret macro events in real time
- Train students to simplify complex macroeconomic phenomena into tractable models
- Enable coherent discussion of macroeconomic policy questions

## Scope of This Session
- Define and measure GDP using three approaches
- Introduce GDP accounting identity: Y = C + I + G + X - M
- Explain inflation measurement via CPI, PPI, and GDP Deflator
- Distinguish nominal vs. real GDP
- Identify biases in inflation measurement

## Out of Scope (for this session)
- Long-run growth models (covered in electives)
- Net Factor Payments (NFP) and open economy details (covered in weeks 9-11)
- Full ISLM model integration (covered starting week 6)

---

# Key Concepts and Definitions

## GDP Definitions
- **Gross Domestic Product (GDP)**: Market value of output produced within a period of time within U.S. borders
- **Gross National Product (GNP)**: Market value of all output produced within a period of time by U.S. citizens
- **Relationship**: GNP = GDP + NFP (Net Factor Payments, e.g., GM's profit in the EU)

## GDP Components (Expenditure Approach)
- **Y**: Total GDP
- **C (Consumption)**: Private spending on final goods and services; includes education and cars (durables) but excludes houses
- **I (Investment)**: Private spending on PPE and housing; goods produced currently for use in future production; excludes education and cars
- **G (Government)**: Government consumption (CG) + Government investment (IG)
- **X - M (Net Exports/NX)**: Exports minus Imports; trade balance

## Inflation Measures
- **Consumer Price Index (CPI)**: Basket representative of consumer purchases
- **Producer Price Index (PPI)**: Selling prices received by domestic producers
- **GDP Deflator**: Basket representing U.S. GDP composition
- **Inflation (π)**: Rate of change in price index

## Nominal vs. Real
- **Nominal GDP**: Pt × Qt (values quantities at current year prices)
- **Real GDP**: PBASE × Qt (values quantities at base year prices)
- **Note**: Nominal and Real GDP are identical in the base year

## Key Terminology
- **Value Added**: Avoids double counting intermediate goods in GDP calculation
- **Final Goods**: Goods purchased by end users, not for further production
- **Intermediate Goods**: Goods used as inputs in production (e.g., oranges sold to JuiceINC)
- **Labor Share**: Proportion of GDP paid as wages/compensation to labor

---

# Inputs, Outputs, and Data Dependencies

## Inputs Required for GDP Calculation

### Expenditure Approach
- Consumer spending on final goods/services (C)
- Private investment in PPE and housing (I)
- Government consumption and investment (G)
- Export values (X)
- Import values (M)

### Product Approach
- Revenue from all firms
- Value of intermediate goods purchased (to subtract and avoid double counting)

### Income Approach
- Wages paid to employees
- Profits earned by firms
- Other income categories (implied but not detailed)

## Inputs Required for Inflation Calculation
- Defined basket of goods (varies by index: CPI, PPI, GDP Deflator)
- Periodic price collection for goods in basket
- Base year prices (for real GDP calculation)

## Outputs
- **GDP (Y)**: Single aggregate measure of economic output
- **Real GDP**: Inflation-adjusted GDP
- **Inflation Rate (π)**: Percentage change in price index
- **GDP by expenditure share**: Breakdown of C, I, G, NX as % of total
- **GDP by industry share**: Services-producing, goods-producing, government
- **GDP by income**: Labor share vs. capital share

## Data Dependencies
- Market prices for all goods and services
- Transaction records (sales, wages, profits)
- Historical price data for base year comparisons
- Basket composition definitions (updated periodically)

---

# Process / Model Logic

## Three Approaches to GDP (All Yield Same Result)

### 1. Expenditure Approach
- Measure purchases of all final goods and services
- Formula: Y = C + I + G + X - M
- **Example**: Oranges sold to public (10,000) + Juice sales (40,000) = 50,000

### 2. Product Approach
- Measure market value of all goods/services produced (except intermediates)
- Subtract intermediate goods to avoid double counting
- **Example**: Orange Inc revenue (35,000) + Juice Inc revenue (40,000) - Oranges purchased by Juice Inc (25,000) = 50,000

### 3. Income Approach
- Measure income earned by all agents (wages + profits)
- **Example**: Orange Inc wages (15,000) + Orange Inc profits (20,000) + Juice Inc wages (10,000) + Juice Inc profits (5,000) = 50,000

## Inflation Measurement Process
1. Define basket of goods
2. Periodically collect prices of those goods
3. Aggregate into price index P
4. Compute inflation as rate of change in P

## Converting Nominal to Real GDP
1. Identify base year
2. Calculate Real GDP = PBASE × Qt
3. Nominal GDP = Pt × Qt
4. In base year, Nominal GDP = Real GDP

---

# Equations, Variables, and Parameters

## Core GDP Identity
```
Y = C + I + G + X - M
```
Where:
- Y = GDP (total output)
- C = Consumption
- I = Investment
- G = Government spending (CG + IG)
- X = Exports
- M = Imports
- NX = X - M (Net Exports)

## Alternative Formulation
```
GNP = GDP + NFP
```
Where:
- GNP = Gross National Product
- NFP = Net Factor Payments (income from abroad)

## Nominal vs. Real GDP
```
Nominal GDP = Pt × Qt
Real GDP = PBASE × Qt
```
Where:
- Pt = Price level in year t
- Qt = Quantity produced in year t
- PBASE = Price level in base year

## Inflation Calculation (implied)
```
π = (Pt - Pt-1) / Pt-1
```
Or equivalently, percentage change in price index

---

# Rules, Constraints, and Assumptions

## GDP Measurement Rules

### Temporal Constraints
- GDP captures output **within a time period**, not from prior periods
- Secondary market transactions do not count (would inflate GDP through repeat sales)

### Double Counting Prevention
- GDP captures **value added**, not gross output
- Intermediate goods must be subtracted in product approach
- **Example**: Tire produced by Firestone → purchased by GM → bought by consumer counts only once

### Geographic vs. Citizenship
- **GDP**: Production within U.S. borders (regardless of producer nationality)
- **GNP**: Production by U.S. citizens (regardless of location)

## Classification Rules

### Consumption (C)
- **Includes**: Education, durable goods like cars
- **Excludes**: Houses (classified as investment)

### Investment (I)
- **Includes**: PPE (plant, property, equipment), housing
- **Concept**: Goods produced currently for use in future production
- **Excludes**: Education, cars

### Government (G)
- Includes both consumption (CG) and investment (IG)
- **Example**: Buying a tank = G
- **Example**: Paying 1,000 people to think about buying a tank = G (via income approach)

## Inflation Measurement Assumptions

### Fixed Basket Assumption
- CPI assumes consumers purchase a fixed basket of goods
- Does not account for substitution behavior when prices change
- **Implication**: Creates upward bias in inflation measurement

### Quality Adjustment Challenges
- Assumes product attributes remain constant
- Does not fully account for quality improvements
- **Implication**: Overstates inflation when quality improves

## Known Biases in CPI (Upward)
- **0.6%** due to new products not captured
- **0.4%** due to product substitution (consumers switch to cheaper alternatives)
- **0.1%** due to retail outlet substitution (e.g., shift to online retail)
- **Total**: ~1.1% upward bias in CPI

## Model Simplification Philosophy
- "Simplest (≠ easy) model that lets us understand what's happening"
- "What is the simplest model that gives a reasonable answer?"
- "Think with a pencil"

---

# UI/UX and Interaction Requirements (if any)

**Not applicable** - This is a lecture-based course with no software UI/UX requirements described in this document.

## Pedagogical Interaction Requirements
- Students should read slides before class
- Students encouraged to identify confusing concepts and relevant work examples
- Students should read economic news (WSJ, FT, NYT) to gauge learning
- Office hours available (stop by or email to schedule)
- Review sessions to be announced by TAs

---

# Technical Requirements and Integration Notes

## Data Sources (Implied)
- U.S. GDP data by expenditure share (1929-2021)
- U.S. GDP by industry share (1947-2017)
- U.S. GDP by income (labor share data)
- Price indices: CPI, PPI, GDP Deflator
- Nominal and Real GDP time series

## Reference Materials
- Textbook (referred to as "ABC" on syllabus)
- Optional readings from WSJ, FT, NYT
- Boskin Report (1996) on CPI bias
- CPI FAQ documentation
- Academic papers on inflation measurement

## Integration with Course Model (ISLM)
- This measurement foundation feeds into:
  - Week 2: Productivity
  - Week 3: Saving
  - Week 4: Money
  - Week 5: Unemployment
  - Week 6: ISLM model integration
  - Weeks 7-11: Policy analysis using ISLM
  - Week 13: Germany case study

## Technical Notes
- GDP Deflator calculation is "harder to compute than might think"
- Challenges include:
  - Goods appearing and disappearing
  - Changes in product quality
  - Consumer basket changes in response to prices
  - Retail outlet changes

---

# Risks, Ambiguities, and Missing Information

## Ambiguities and Open Questions

### GDP Measurement Validity
- **Question**: Does GDP adequately measure well-being in the modern economy?
- **References cited**: "RIP GDP" (NYT 2009), "Recalculating GDP for the Facebook age" (FT 2018)
- **Implication**: GDP may not capture digital economy value, non-market activities, or quality of life

### Cross-Sectional vs. Time Series Relationship
- Document shows GDP correlates with happiness cross-sectionally (Stevenson and Wolfers 2008)
- **Question**: Does this relationship hold in time series? (Chart shown but not discussed)

### Government Spending Productivity
- Example: Paying 1,000 people to think about buying a tank counts as GDP
- **Question**: Does this represent "wasted inefficiency" or legitimate economic activity?
- **Answer provided**: This is a productivity question (next class), not a GDP measurement question

### Inflation Bias Corrections
- Known biases total ~1.1% upward
- **Question**: Are these biases corrected in official statistics?
- **Question**: How frequently are basket compositions updated?
- **Missing**: Specific methodology for quality adjustments

### China and Argentina Data Quality
- References to articles questioning data quality:
  - "China's Economic Growth Looks Strong. Maybe Too Strong" (NYT 2018)
  - "Don't Lie to Me, Argentina" (2012)
- **Question**: How should analysts adjust for suspected data manipulation?

## Missing Information

### Calculation Details
- Exact formula for GDP Deflator not provided
- Methodology for quality adjustments not specified
- Frequency of basket updates not stated
- Specific goods included in CPI/PPI baskets not listed

### Historical Context
- Why 1947 chosen as start date for industry share chart?
- What constitutes the "base year" in current use?
- How has the base year changed over time?

### International Comparisons
- NFP (Net Factor Payments) mentioned but not quantified
- Open economy details deferred to weeks 9-11
- No discussion of purchasing power parity or exchange rate effects on GDP

### Policy Implications
- Fed interest rate decision framework not yet introduced
- Connection between inflation measurement and monetary policy not yet established
- Trade deficit interpretation disputed (reference to Trump Economic Plan critique) but not resolved

## Risks

### Pedagogical Risks
- "The first half of this class can be difficult" (acknowledged in teaching evaluations)
- Students may become "lost in class to the point of no return"
- **Mitigation**: Students encouraged to ask for repetition, re-watch lectures, attend office hours

### Model Limitations
- ISLM is a simplified model
- **Risk**: Over-reliance on simplified model may miss important real-world complexities
- **Mitigation**: Course emphasizes understanding assumptions behind conclusions

### Data Quality
- Measurement biases are systematic and known
- **Risk**: Policy decisions based on biased data may be suboptimal
- **Mitigation**: Awareness of bias direction and magnitude

---

# Recommended Next Steps

## For Course Participants (Students)

### Immediate Actions
1. Read slides before each class session
2. Identify confusing concepts and prepare questions
3. Begin reading economic news coverage (WSJ, FT, NYT) regularly
4. Review optional media related to GDP and inflation measurement
5. Ensure understanding of GDP accounting identity before Week 2

### Ongoing Practices
6. Connect course concepts to work experience and current events
7. Attend review sessions (details to be announced by TAs)
8. Use office hours proactively when falling behind
9. Practice "thinking with a pencil" - simplify complex problems

### Preparation for Next Session (Week 2: Productivity)
10. Understand that government spending efficiency is a productivity question
11. Review relationship between inputs, outputs, and value creation
12. Consider how productivity relates to GDP measurement

## For Course Designers / Instructors

### Content Development
1. Finalize syllabus with updated article links
2. Prepare detailed examples of GDP calculation using all three approaches
3. Develop exercises on identifying inflation biases
4. Create case studies on data quality issues (China, Argentina examples)

### Assessment Design
5. Design problem sets testing GDP calculation via expenditure, product, and income approaches
6. Include questions on nominal vs. real GDP conversion
7. Test understanding of inflation bias sources and directions
8. Assess ability to interpret news articles using measurement concepts

### Support Infrastructure
9. Announce TA review session schedule
10. Provide worked examples of GDP calculations (OrangeINC/JuiceINC style)
11. Create reference sheet for GDP identity and component definitions
12. Compile list of recommended news sources and specific articles

## For Implementation / Engineering (if building tools)

### Data Requirements
1. Source historical GDP data (nominal and real) from official sources
2. Obtain CPI, PPI, and GDP Deflator time series
3. Collect GDP by expenditure, industry, and income breakdowns
4. Acquire international GDP data for cross-country comparisons

### Calculation Tools
5. Implement GDP calculator supporting all three approaches
6. Build nominal-to-real GDP converter with selectable base years
7. Create inflation calculator for CPI, PPI, GDP Deflator
8. Develop bias adjustment tool showing impact of known

### 02_productivity_kd.pdf

# Executive Summary

This document is a lecture slide deck from MGT 425: Macroeconomic Analysis (Yale School of Management) covering Topic 2: Productivity and Labor Demand. It introduces foundational macroeconomic concepts including Total Factor Productivity (TFP), production functions, and labor market dynamics. The material establishes a framework for understanding GDP growth drivers, measuring productivity as a residual, and modeling labor demand/supply relationships. Key empirical examples include post-war U.S. TFP trends and the Asian Tiger economies. The lecture sets up a modeling roadmap for subsequent course topics (capital markets, asset markets, ISLM framework).

---

# Purpose and Scope

## Purpose
- Teach students how productivity and labor inputs drive GDP growth
- Explain how to measure Total Factor Productivity (TFP) as a residual
- Develop labor demand and supply models for macroeconomic analysis
- Provide empirical context through historical U.S. and Asian Tiger case studies

## Scope
- **In Scope:**
  - Production function framework (Y = A K^α L^(1-α))
  - TFP measurement methodology
  - Labor demand derivation from profit maximization
  - Labor supply determinants (wages, taxes, expectations)
  - Comparative statics (productivity shocks, wage changes)
  
- **Out of Scope (deferred to later lectures):**
  - Capital market dynamics (savings, investment)
  - Asset markets and inflation
  - ISLM integration
  - Interest rate effects on labor supply
  - Why productivity growth prevents inflation during expansion (Topic 4)

---

# Key Concepts and Definitions

## Core Definitions
- **GDP (Y):** Total economic output
- **Total Factor Productivity (TFP / A):** Unobserved efficiency with which inputs are used; "measure of our ignorance"
- **Capital (K):** Physical capital stock (machines, equipment)
- **Labor (L):** Worker hours or headcount
- **α (alpha):** Parameter indicating relative importance of capital vs. labor in production
- **Marginal Product of Labor (MPL):** Additional output from one more unit of labor
- **Labor Force Participation:** Share of population actively working

## Key Relationships
- **Production Function:** Y = A K^α L^(1-α)
- **TFP as Residual:** ε = ln(Y) - α·ln(K) - (1-α)·ln(L), where ε represents ln(A)
- **Profit Maximization Rule:** Hire labor until MPL = w (wage)
- **Labor Demand:** Downward sloping relationship between wage and quantity of labor demanded

## Empirical Context
- **Asian Tiger Miracle:** High GDP growth (7-9% annually, 1966-1990) driven primarily by input accumulation (labor force participation, education) rather than TFP growth
- **Post-War U.S. TFP:** Shows periods of slow growth (requiring explanation) and rapid growth (requiring explanation)

---

# Inputs, Outputs, and Data Dependencies

## Inputs Required
- **GDP (Y):** Time series of real GDP
- **Capital Stock (K):** Measured inventory of physical capital
- **Labor (L):** Hours worked or employment headcount
- **Production Function Parameters:** α value (capital share)
- **Wage Rate (w):** Current and expected future wages
- **Tax Rates:** Income tax rates affecting labor supply
- **Interest Rates:** (mentioned as affecting labor supply, details deferred)

## Outputs Generated
- **TFP Index (A):** Calculated as residual from production function
- **Labor Demand Curve (LD):** Relationship between wage and labor quantity demanded
- **Labor Supply Curve (LS):** Relationship between wage and labor quantity supplied
- **Equilibrium Employment (L*):** Intersection of LD and LS
- **Equilibrium Wage (w*):** Market-clearing wage

## Data Dependencies
- **TFP Calculation:** Requires GDP, K, L, and α as inputs
- **Labor Demand:** Depends on current A, current K, and wage w
- **Labor Supply:** Depends on current wage, expected future wage (wF), tax policy, interest rates
- **Historical Data Sources:** Federal Reserve Economic Data (FRED) cited for U.S. TFP index

---

# Process / Model Logic

## TFP Measurement Process
1. Start with production function: Y = A K^α L^(1-α)
2. Divide both sides by L: Y/L = A K^α L^(-α)
3. Take natural logs: ln(Y/L) = ln(A) + α·ln(K/L)
4. Rearrange to isolate TFP: ln(A) = ln(Y) - α·ln(K) - (1-α)·ln(L)
5. Define ε = ln(A) as the residual
6. Calculate TFP growth as residual after accounting for K and L growth

## Labor Demand Derivation
1. Assume capital (K) is fixed in short run
2. Production function becomes Y = A K^α L^(1-α) with K constant
3. Firm faces wage cost = w·L (linear in L)
4. Marginal product of labor (MPL) declines as L increases (diminishing returns)
5. Profit-maximizing firm hires until MPL = w
6. Lower wage → hire more labor until MPL falls to new wage level
7. Result: Downward-sloping labor demand curve

## Comparative Statics Logic

### Productivity Shock (A increases)
1. Production function shifts up: Y = A₁ K^α L^(1-α) where A₁ > A₀
2. At original employment L₀, MPL increases
3. Since MPL > w, firm hires more labor
4. Labor demand curve shifts right (LD₀ → LD₁)
5. New equilibrium: higher employment and higher wage

### Wage Increase (w increases)
1. Higher wage increases cost of labor
2. Firm reduces hiring until MPL rises to meet new wage
3. Movement along labor demand curve (not a shift)
4. Result: Lower employment at higher wage

### Expected Future Wage Increase (wF increases)
1. Workers anticipate higher wages in future
2. Substitute leisure today for work tomorrow
3. Labor supply curve shifts left (LS₀ → LS₁)
4. Result: Higher current wage, lower current employment

---

# Equations, Variables, and Parameters

## Primary Production Function
```
Y = A K^α L^(1-α)
```
Where:
- Y = Real GDP (output)
- A = Total Factor Productivity
- K = Capital stock
- L = Labor input
- α = Capital share parameter (0 < α < 1)
- (1-α) = Labor share parameter

## TFP Calculation (Residual Method)
```
ln(A) = ln(Y) - α·ln(K) - (1-α)·ln(L)
```
Or equivalently:
```
ε = ln(Y) - α·ln(K) - (1-α)·ln(L)
```
Where ε represents ln(A)

## Labor Productivity (Alternative Measure)
```
Labor Productivity = Y/L
```
Note: Directly measurable, unlike TFP which is a residual

## Profit Maximization Condition
```
MPL = w
```
Where:
- MPL = Marginal Product of Labor
- w = Wage rate

## Variables and Parameters

| Symbol | Description | Type | Typical Range/Units |
|--------|-------------|------|---------------------|
| Y | Real GDP | Endogenous variable | Currency units |
| A | Total Factor Productivity | Residual/Index | Index (base year = 100) |
| K | Capital stock | Exogenous (short run) | Physical units |
| L | Labor | Endogenous variable | Hours or workers |
| α | Capital share | Parameter | 0 < α < 1 (typically ~0.3) |
| w | Wage rate | Endogenous variable | Currency per hour/worker |
| wF | Expected future wage | Exogenous expectation | Currency per hour/worker |
| MPL | Marginal product of labor | Derived variable | Output per worker |

---

# Rules, Constraints, and Assumptions

## Core Assumptions

### Production Function Assumptions
- **Cobb-Douglas functional form:** Y = A K^α L^(1-α)
- **Constant returns to scale:** Doubling K and L doubles Y
- **Diminishing marginal returns:** MPL declines as L increases (holding K constant)
- **Capital is fixed in short run:** K treated as exogenous for labor demand analysis
- **All workers are homogeneous:** Paid same wage w regardless of quantity hired
- **Wage is exogenous to individual firm:** Firm is wage-taker in competitive labor market

### Labor Market Assumptions
- **Firms maximize profits:** Hire until MPL = w
- **Workers choose between labor and leisure:** Labor supply responds to wage incentives
- **Perfect competition:** Many firms and workers, no market power
- **Wage flexibility:** Wages adjust to clear labor market (no discussion of rigidities)

## Constraints

### Measurement Constraints
- **TFP is unobservable directly:** Must be calculated as residual
- **TFP captures "ignorance":** Includes all factors not captured by K and L (management quality, technology, institutions, measurement error)
- **Data requirements:** Need reliable time series for Y, K, L, and estimate of α

### Behavioral Constraints
- **Profit maximization:** Firms must follow MPL = w rule
- **Diminishing returns:** Production function must exhibit declining MPL

## Rules

### Labor Demand Rules
1. **Hiring rule:** Hire labor until MPL = w
2. **Stopping rule:** Do not hire if MPL < w (would reduce profit)
3. **Expansion rule:** If MPL > w, hire more labor
4. **Slope rule:** Labor demand curve is downward sloping

### Labor Supply Rules
1. **Wage response:** LS increases with current wage (w)
2. **Expectation response:** LS decreases with expected future wage (wF)
3. **Tax response:** Effect depends on specific tax policy (ambiguous direction)
4. **Interest rate response:** (Mentioned but not detailed; deferred to later lecture)

### Shift Rules

**Labor Demand Shifts Right (increases) when:**
- Productivity (A) increases
- Capital stock (K) increases

**Labor Demand Shifts Left (decreases) when:**
- Productivity (A) decreases
- Capital stock (K) decreases

**Labor Supply Shifts Right (increases) when:**
- Expected future wage (wF) decreases
- Tax policy changes favorably (context-dependent)

**Labor Supply Shifts Left (decreases) when:**
- Expected future wage (wF) increases
- Tax policy changes unfavorably (context-dependent)

---

# UI/UX and Interaction Requirements (if any)

## Presentation Requirements
- **Animation dependency:** Slides contain "carefully constructed animations to facilitate how curves are constructed and move around"
- **Viewing mode:** Animations best viewed in presentation mode rather than canvas/edit mode
- **Sequential revelation:** Curves and relationships should be revealed step-by-step for pedagogical clarity

## Graphical Display Requirements

### Production Function Graphs
- **Axes:** Y (vertical) vs. L (horizontal)
- **Curves:** Concave production function Y = A K^α L^(1-α)
- **Lines:** Linear wage cost line w·L with varying slopes
- **Annotations:** MPL tangent lines at specific L values

### Labor Market Graphs
- **Axes:** w (vertical) vs. L (horizontal)
- **Curves:** Downward-sloping LD, upward-sloping LS
- **Equilibrium points:** Intersection of LD and LS
- **Shift indicators:** Multiple LD or LS curves with subscripts (LD₀, LD₁, etc.)

### Interactive Elements (Implied)
- Students should be able to identify periods on TFP graphs
- Students should indicate directional impacts of shocks on labor market graphs
- "MGT425 Consulting, LLC" section implies student discussion/polling on future productivity

---

# Technical Requirements and Integration Notes

## Data Sources
- **Federal Reserve Economic Data (FRED):** U.S. TFP index
  - Specific series: RTFPNAUSA632NRUG
  - URL: https://research.stlouisfed.org/fred2/series/RTFPNAUSA632NRUG#

## Calculation Requirements
- **TFP calculation engine:** Must compute ln(Y) - α·ln(K) - (1-α)·ln(L)
- **Parameter estimation:** Need method to estimate α (capital share)
- **Time series handling:** Must process quarterly or annual data for Y, K, L

## Integration with Course Framework
- **Modeling roadmap dependencies:**
  1. Labor Market (current topic) → provides L*
  2. Capital Market (future) → provides K*, investment, savings
  3. Asset Market (future) → provides money supply, inflation
  4. ISLM (future) → integrates all markets
  
- **Forward references:**
  - Interest rate effects on labor supply (deferred)
  - Productivity-inflation relationship (Topic 4: Money)
  - Open economy extensions (Topics 9-11)

## Empirical Analysis Requirements

### Asian Tiger Analysis
- **Data needs:** GDP growth, population growth, labor force participation by education level
- **Time periods:** 1966-1990/1991 (varies by country)
- **Countries:** Hong Kong, Singapore, Korea, Taiwan
- **Decomposition:** Separate GDP growth into input growth vs. TFP growth

### U.S. TFP Analysis
- **Pattern recognition:** Identify periods of slow vs. rapid TFP growth
- **Explanation requirement:** Provide potential explanations for identified patterns
- **Historical context:** Post-war period (post-1945)

---

# Risks, Ambiguities, and Missing Information

## Ambiguities and Unclear Specifications

### Parameter Values
- **Question:** What is the assumed value of α (capital share)?
  - Document does not specify numerical value
  - Typical range is 0.3-0.4 but not stated
  
### Time Horizons
- **Question:** What defines "short run" vs. "long run"?
  - K is "fixed" in short run but no time period specified
  - When does K become variable?

### Labor Supply Functional Form
- **Question:** What is the precise functional form of labor supply?
  - LS = f(w, wF, taxes, interest rate) but no equation given
  - Slope and curvature not specified
  
### Tax Policy Effects
- **Ambiguity:** "LS can rise or fall with taxes, depending on the particular policy"
  - Income tax example mentioned but mechanism not explained
  - Laffer curve shown but connection to labor supply unclear
  - No guidance on which tax policies increase vs. decrease LS

### Interest Rate Mechanism
- **Missing:** "LS also sensitive to interest rate (next time!)"
  - Mechanism not explained
  - Direction of effect not specified
  - Deferred to future lecture

## Measurement Issues

### TFP as "Measure of Ignorance"
- **Risk:** TFP residual captures everything not in K and L
  - Includes true productivity improvements
  - Also includes measurement errors in Y, K, or L
  - Includes omitted factors (human capital, institutions, etc.)
  - No guidance on decomposing these components

### Capital Stock Measurement
- **Question:** How is K measured in practice?
  - Perpetual inventory method?
  - Depreciation assumptions?
  - Quality adjustments?

### Labor Measurement
- **Question:** Is L measured as hours or headcount?
  - Document uses both concepts interchangeably
  - Quality/skill adjustments needed?

## Conceptual Gaps

### Worker Matching and Productivity
- **Question:** How does "better matching of workers" map to the model?
  - Article claims matching increases productivity
  - Is this captured in A (TFP) or L (labor quality)?
  - No formal treatment of matching in production function

### AI and Productivity
- **Question:** How is AI investment categorized?
  - Physical servers/hardware = K (capital)?
  - Software/algorithms = A (TFP)?
  - No clear guidance in framework

### Wage Determination
- **Ambiguity:** Wage is treated as exogenous to firm but endogenous to market
  - How is market wage determined?
  - What happens if wages are sticky

### 03_saving_kd.pdf

# Executive Summary

This document is a lecture presentation on macroeconomic savings theory, focusing on the derivation and interpretation of the IS (Investment-Savings) curve. It establishes the fundamental relationship between investment demand, savings supply, and the real interest rate in a closed economy. The core insight is that goods-market equilibrium requires investment to equal savings (I = S), and the real interest rate adjusts to maintain this equilibrium. The IS curve represents all combinations of real interest rates (r) and GDP (Y) that satisfy this equilibrium condition. The document prepares students to integrate the IS curve with the LM curve and Full Employment (FE) curve to model general macroeconomic equilibrium.

---

# Purpose and Scope

## Purpose
- Teach the construction and interpretation of the IS curve as one component of the ISLM macroeconomic model
- Explain the determinants of investment demand and savings supply
- Demonstrate how the real interest rate equilibrates the goods market
- Provide framework for analyzing fiscal policy, productivity shocks, and savings behavior

## Scope
- **In Scope:**
  - Closed economy model (no international trade beyond X = M = 0)
  - Investment demand driven by future productivity
  - Savings supply from households and government
  - Real interest rate as equilibrating mechanism
  - Shifts vs. movements along the IS curve
  - Application to European savings policy question

- **Out of Scope:**
  - Open economy considerations (covered in later weeks)
  - LM curve derivation (next class)
  - Full Employment (FE) curve (future topic)
  - Detailed wealth effects modeling
  - Formal mathematical proofs (referenced in ABC Appendix 4A)
  - AD/AS alternative framework (ABC chapters 8-9, not covered in class)

---

# Key Concepts and Definitions

## Core Variables
- **Y**: GDP = income = expenditures = output
- **C**: Consumption
- **I**: Investment (flow variable)
- **G**: Government consumption and investment
- **S**: Saving (flow variable)
- **SP**: Private saving
- **SG**: Public/government saving
- **K**: Capital stock (stock variable)
- **r**: Real interest rate
- **W**: Wealth (stock variable, NOT savings)
- **A**: Total Factor Productivity (TFP) - current
- **AF**: Future TFP
- **MPK**: Marginal Product of Capital - current
- **MPKF**: Future Marginal Product of Capital
- **YF**: Future income
- **L**: Labor
- **T**: Taxes

## Key Relationships
- **GDP Identity**: Y = C + I + G (closed economy, where X = M = 0)
- **Savings Identity**: I = S = SP + SG
- **Private Savings**: SP = Y - C - T
- **Government Savings**: SG = T - G
- **IS Curve**: The set of (r, Y) combinations where I = S (goods market equilibrium)

## Theoretical Frameworks
- **Keynes' Marginal Propensity to Consume (MPC)**: Individuals consume a constant share (b) of income changes; consumption smoothing occurs
- **Friedman's Lifetime Income Hypothesis**: Consumption/savings based on present value of lifetime income; stronger reaction to permanent vs. temporary income changes

## Important Distinctions
- **Stock vs. Flow**: Wealth (W) is a stock; Savings (S) is a flow
- **Current vs. Future**: Investment depends on AF (future TFP), not A (current TFP)
- **Movement vs. Shift**: Changes in Y or r cause movements along IS curve; changes in AF, YF, W, or SG cause shifts of the IS curve

---

# Inputs, Outputs, and Data Dependencies

## Inputs to Investment Demand (I)
- **Future TFP (AF)**: Primary driver via MPKF
- **Real interest rate (r)**: Negative relationship
- **Tax policy (t)**: Effective tax rate on investment
- **Depreciation rates**: Part of user cost of capital
- **Current capital stock (K)**: Affects K/L ratio and MPKF

## Inputs to Savings Supply (S)
- **Current income (Y)**: Positive relationship
- **Future income (YF)**: Negative relationship (higher YF → consume more today)
- **Wealth (W)**: Negative relationship (higher W → consume more, save less)
- **Real interest rate (r)**: Positive relationship (assuming substitution effect dominates income effect)
- **Government spending (G)** and **Taxes (T)**: Determine SG = T - G

## Outputs
- **Equilibrium real interest rate (r*)**: The rate at which S = I
- **IS Curve**: Mapping of (r, Y) pairs satisfying goods market equilibrium
- **Investment level**: Determined at equilibrium
- **Savings level**: Determined at equilibrium (equals investment)

## Data Dependencies
- Production function parameters (capital, labor, TFP)
- Expectations about future productivity (AF)
- Fiscal policy parameters (G, T)
- Household wealth levels
- Marginal propensity to consume (b)

---

# Process / Model Logic

## Investment Demand Logic
1. Capital (K) is distinguished by taking time to build
2. Current investment (It) becomes future capital (Kt+1)
3. Investment demand driven by **future** marginal product of capital (MPKF)
4. MPKF depends on future TFP (AF)
5. Higher expected AF → higher MPKF → more investment today
6. Higher real interest rate (r) → lower investment (higher cost of capital)
7. **Investment is forward-looking**: depends on AF, not current A

## Savings Supply Logic
1. Total savings: S = SP + SG
2. Private savings motivated by **consumption smoothing**
3. Households save to maintain stable consumption across time periods
4. Higher current income (Y) → higher savings
5. Higher future income (YF) → lower savings today (can consume more now)
6. Higher wealth (W) → lower savings (consume more from wealth)
7. Higher real interest rate (r) → higher savings (consumption today more expensive)

## Equilibrium Mechanism
1. In closed economy: Y = C + I + G
2. Rearranging: I = Y - C - G = (Y - C - T) + (T - G) = SP + SG = S
3. Banks intermediate between savers and investors
4. Banks adjust real interest rate (r) to equilibrate S and I:
   - If I > S: banks raise r to boost S and reduce I
   - If I < S: banks lower r to boost I and reduce S
5. Equilibrium at r* where S(r*, Y, YF, W, SG) = I(r*, AF)

## IS Curve Derivation
1. Start with S and I curves in (S,I) vs r space
2. Increase Y → S curve shifts right (higher income → more savings)
3. To maintain S = I, r must fall
4. Trace out negative relationship between Y and r
5. This (r, Y) relationship is the **IS curve**
6. Every point on IS curve represents goods market equilibrium (I = S) for that (r, Y) combination

## IS Curve Shifts
**Rightward/upward shifts (I > S at original r, Y):**
- Future productivity (AF) rises → investment demand increases
- Future income (YF) rises → savings falls
- Wealth (W) rises → savings falls
- Government savings (SG) falls (G rises or T falls) → total savings falls

**Leftward/downward shifts (I < S at original r, Y):**
- Future productivity (AF) falls
- Future income (YF) falls
- Wealth (W) falls
- Government savings (SG) rises

---

# Equations, Variables, and Parameters

## Core Identities
```
Y = C + I + G + X - M          [General GDP identity]
Y = C + I + G                  [Closed economy: X = M = 0]
I = Y - C - G                  [Rearranged]
I = (Y - C - T) + (T - G)      [Adding/subtracting T]
I = SP + SG                    [Definition of private and public savings]
I = S                          [Total savings equals investment]
```

## Savings Components
```
SP = Y - C - T                 [Private savings]
SG = T - G                     [Government/public savings]
S = SP + SG                    [Total savings]
```

## Functional Relationships

### Investment Demand
```
I = I(r, AF, t, ...)
∂I/∂r < 0                      [Investment falls as interest rate rises]
∂I/∂AF > 0                     [Investment rises as future productivity rises]
∂I/∂t < 0                      [Investment falls as effective tax rate rises]
```

### Savings Supply
```
S = S(r, Y, YF, W, SG)
∂S/∂r > 0                      [Savings rises with interest rate]*
∂S/∂Y > 0                      [Savings rises with current income]
∂S/∂YF < 0                     [Savings falls with future income]
∂S/∂W < 0                      [Savings falls with wealth]
∂S/∂SG > 0                     [Total savings rises with government savings]
```
*Assuming substitution effect dominates income effect

### IS Curve
```
IS: r = r(Y, AF, YF, W, SG)
∂r/∂Y < 0                      [Along IS curve: r falls as Y rises]

Shifts:
∂r/∂AF > 0                     [IS shifts up/right when AF rises]
∂r/∂YF > 0                     [IS shifts up/right when YF rises]
∂r/∂W > 0                      [IS shifts up/right when W rises]
∂r/∂SG < 0                     [IS shifts up/right when SG falls]
```

## Parameters
- **b**: Marginal propensity to consume (MPC) - Keynesian model
- **t**: Effective tax rate on investment
- Depreciation rates (part of user cost of capital)
- Production function parameters (elasticities, etc.)

---

# Rules, Constraints, and Assumptions

## Core Assumptions
1. **Closed economy**: No net international trade (X = M = 0)
2. **Banks intermediate perfectly**: Real interest rate adjusts to ensure S = I
3. **Consumption smoothing**: Households prefer stable consumption over time
4. **Forward-looking investment**: Firms invest based on future (AF), not current (A) productivity
5. **Substitution effect dominates**: For savings response to interest rates
6. **Rational expectations**: Agents form expectations about YF, AF

## Constraints
1. **Resource constraint**: Investment can only come from non-consumed income in closed economy
2. **Time to build**: Capital takes time to construct; current investment yields future capital
3. **Budget constraints**: 
   - Private: Y = C + SP + T
   - Government: T = G + SG
   - National: Y = C + I + G

## Behavioral Rules

### Consumption Smoothing
- Consumption falls less than income in bad times
- Consumption rises less than income in good times
- Stronger smoothing for temporary vs. permanent income shocks

### Investment Response
- Cancel projects when interest rates rise
- Increase investment when future productivity expectations improve
- Respond to tax incentives and depreciation rules

### Savings Response
- Save more when current income high relative to expected future income
- Save less when wealthy (can draw down wealth)
- Save more when interest rates high (intertemporal substitution)

## Equilibrium Conditions
1. **Goods market equilibrium**: I = S (defines the IS curve)
2. **General equilibrium** (future topic): Intersection of IS, LM, and FE curves
3. **Bank optimization**: Set r to clear goods market

---

# UI/UX and Interaction Requirements (if any)

## Presentation Requirements
- **Animation-dependent**: Slides contain "carefully constructed animations to facilitate how curves are constructed and move around"
- **Viewing mode**: Animations best viewed in presentation mode (not canvas mode)
- Animations likely show:
  - Sequential shifts of S curve as Y increases
  - Derivation of IS curve from S-I equilibrium
  - Shifts of I curve due to AF changes
  - Resulting IS curve shifts

## Pedagogical Interaction
- Students should be able to:
  - Trace movements along IS curve (changes in Y and r)
  - Identify shifts of IS curve (changes in AF, YF, W, SG)
  - Distinguish between S-I diagram and IS curve diagram
  - Work through "Test Your Knowledge" scenarios

## Diagram Requirements
- **S-I Diagram**: 
  - Vertical axis: r (real interest rate)
  - Horizontal axis: S, I (savings and investment)
  - Show S curve (upward sloping), I curve (downward sloping)
  - Mark equilibrium r*
  
- **IS Curve Diagram**:
  - Vertical axis: r (real interest rate)
  - Horizontal axis: Y (GDP)
  - Show IS curve (downward sloping)
  - Mark equilibrium (r*, Y*)

- **Combined ISLM Framework** (future):
  - Add LM curve (upward sloping)
  - Add FE curve (vertical line)
  - Show general equilibrium at intersection

---

# Technical Requirements and Integration Notes

## Model Integration
- **Current position**: Building IS curve (first component of ISLM model)
- **Next steps**: 
  - Derive LM curve (asset/money market equilibrium)
  - Derive FE curve (full employment GDP)
  - Integrate all three for general equilibrium analysis
- **Week 4 goal**: Use complete ISLM model for policy analysis

## Data Requirements
- Historical and expected TFP (A and AF)
- National accounts data (Y, C, I, G)
- Fiscal policy parameters (T, G)
- Household wealth data (W)
- Interest rate data (r)
- Labor market data (for production function)

## Calculation Requirements
- Compute private savings: SP = Y - C - T
- Compute government savings: SG = T - G
- Verify identity: I = S = SP + SG
- Determine equilibrium r* from S(r) = I(r) for given Y
- Trace IS curve across different Y values
- Calculate shifts in IS curve from parameter changes

## Alternative Frameworks
- **AD/AS model**: Alternative approach in ABC chapters 8-9
  - Not covered in class due to time constraints
  - May be helpful supplementary reading
  - Motivates same IS curve concepts differently
- **Formal savings model**: ABC Appendix 4A provides mathematical derivation

## Empirical Validation
- Evidence of consumption smoothing in GDP vs. C data
- Differential response to permanent vs. temporary income shocks
- Fiscal stimulus effects depend on consumption smoothing behavior
- Tax cut effectiveness depends on whether consumers perceive as permanent or temporary

---

# Risks, Ambiguities, and Missing Information

## Ambiguities and Unclear Specifications

1. **Substitution vs. Income Effect**: 
   - Document assumes substitution effect dominates for ∂S/∂r > 0
   - **Question**: Under what conditions might income effect dominate? How to test empirically?

2. **Marginal Propensity to Consume (b)**:
   - Introduced conceptually but not quantified
   - **Question**: What is the empirical range for b? Does it vary by country, income level, or time period?

3. **Future Expectations Formation**:
   - Model assumes agents form expectations about AF and YF
   - **Question**: How are these expectations formed? Adaptive? Rational? Model-based?
   - **Question**: How to measure or proxy AF in practice?

4. **Tax Policy Details**:
   - References "effective tax rate (t)" and "tax policy" affecting investment
   - **Question**: Which specific taxes matter most? Income tax? Corporate tax? Investment tax credits?
   - **Question**: How to calculate effective tax rate from actual tax code?

5. **Wealth Shocks vs. Income Shocks**:
   - Document states these have "DIFFERENT implications"
   - **Question**: What are the quantitative differences in impact on savings?
   - **Question**: How to empirically distinguish wealth effects from income effects?

6. **Bank Intermediation Mechanism**:
   - Banks described as setting r to

### 04_money_kd.pdf

# Executive Summary

This document is a lecture presentation on **Money and the LM Curve** from MGT 425: Macroeconomic Analysis at Yale School of Management. It explains how the money market equilibrium (LM curve) is derived from the interaction of money supply (controlled by central banks) and money demand (driven by economic factors). The LM curve represents combinations of real interest rates (r) and real GDP (Y) where money supply equals money demand. Combined with the IS curve (goods market equilibrium) and the FE curve (full employment), the LM curve forms part of the IS-LM macroeconomic model used to analyze general equilibrium. The document includes theoretical foundations, real-world examples (Turkey, Zimbabwe), and central bank policy mechanisms.

---

# Purpose and Scope

## Purpose
- Explain what the LM curve represents in macroeconomic modeling
- Define the role of money in an economy and how central banks influence money supply
- Illustrate how money market equilibrium is achieved through the interaction of money supply and demand
- Provide context for understanding Federal Reserve interest rate policy

## Scope
- **In Scope:**
  - Definition and properties of money
  - Money demand determinants and functional form
  - Money supply control by central banks
  - Derivation of the LM curve from money market equilibrium
  - Shifts in the LM curve due to changes in money supply, price level, and other factors
  - Real-world examples of monetary policy failures and successes
  - Central bank tools and mandates
  - Alternative monetary policy frameworks (Taylor Rule, gold standard, nominal GDP targeting)

- **Out of Scope:**
  - Detailed derivation of IS curve (covered in previous lecture)
  - Full employment (FE) curve (to be covered later)
  - Complete IS-LM model applications (to be covered in subsequent classes)
  - Open economy considerations (covered in weeks 9-11)

---

# Key Concepts and Definitions

## Core Definitions
- **Money (M)**: A special class of assets with three key attributes:
  - Unit of account
  - Medium of exchange
  - Store of value

- **Monetary Aggregates:**
  - **C** = Currency
  - **M1** = C + traveler's checks + demand deposits
  - **M2** = M1 + savings deposits + money market mutual funds

- **LM Curve**: Represents money market equilibrium; traces combinations of real interest rate (r) and real GDP (Y) where money supply equals money demand (MS/P = L(.))

- **IS Curve**: Represents goods market equilibrium where Y = C + I + G (and S = I in closed economy)

- **FE Curve**: Represents full employment GDP

- **General Equilibrium**: The intersection of IS, LM, and FE curves where all markets clear simultaneously

## Key Variables
- **r** = real interest rate
- **Y** = real GDP (income, output, expenditures)
- **P** = price level
- **MS** = money supply (nominal)
- **MD** = money demand (nominal)
- **π (p)** = inflation rate
- **πᵉ (pᵉ)** = expected inflation
- **L(.)** = real money demand function (demand for liquidity)
- **W** = wealth
- **riskₐₗₜ** = riskiness of non-cash assets
- **liqₐₗₜ** = liquidity of non-cash assets

## Central Banking Terms
- **Federal Reserve (Fed)**: U.S. central bank
- **Federal Funds Rate**: Rate at which financial institutions lend to each other
- **Discount Rate**: Rate at which the Fed lends to banks
- **Open Market Operations**: Fed buying/selling government securities
- **Reserve Requirements**: Minimum reserves banks must hold
- **Quantitative Easing (QE)**: Large-scale asset purchases by central bank

---

# Inputs, Outputs, and Data Dependencies

## Inputs to Money Demand Function
**MD = P × L(Y, r, πᵉ, wealth, riskₐₗₜ, liqₐₗₜ, payment technology)**

| Input | Effect on MD | Rationale |
|-------|--------------|-----------|
| P (price level) | MD rises 1:1 with P | Need more cash for same real purchases |
| Y (real income) | MD rises as Y rises | Higher income → more transactions → more cash needed |
| r (real interest rate) | MD falls as r rises | Higher opportunity cost of holding cash vs. interest-bearing assets |
| πᵉ (expected inflation) | MD falls as πᵉ rises | Cash loses value faster; prefer real assets |
| W (wealth) | MD rises as W rises | More wealth → more transactions/precautionary demand |
| riskₐₗₜ | MD rises as riskₐₗₜ rises | Cash becomes relatively safer |
| liqₐₗₜ | MD falls as liqₐₗₜ rises | Other assets become better substitutes for cash |
| Payment technology | MD falls as technology improves | ATMs, debit cards reduce need for cash on hand |

**Empirical Elasticities (noted in document):**
- Elasticity of MD with respect to Y ≈ 2/3
- Elasticity of MD with respect to r ≈ -1/10

## Outputs
- **LM Curve**: Graphical relationship between r and Y that satisfies MS/P = L(.)
- **Equilibrium interest rate**: Where money supply equals money demand for given Y
- **Policy recommendations**: Based on position relative to equilibrium

## Data Dependencies
- **Published by Federal Reserve:**
  - Monetary aggregates (C, M1, M2)
  - Data from banks, Treasury, mutual funds
- **Economic indicators:**
  - Real GDP (Y)
  - Price level/CPI (P)
  - Interest rates (r, nominal rates)
  - Inflation expectations (πᵉ)

---

# Process / Model Logic

## Deriving the LM Curve

### Step 1: Money Market Equilibrium Condition
**MS/P = L(Y, r, πᵉ, wealth, riskₐₗₜ, liqₐₗₜ, payment technology)**

- Real money supply (MS/P) must equal real money demand (L(.))
- Assume P is fixed initially for derivation

### Step 2: Trace Equilibrium as Y Changes
1. Start with initial income Y₀ and equilibrium interest rate r₀
2. Increase Y to Y₁ (exogenous shock)
3. At unchanged r₀, money demand L(Y₁, r₀) > MS/P (excess demand)
4. Interest rate must rise to r₁ to restore equilibrium (higher r reduces L(.))
5. Repeat for Y₂, Y₃, etc.
6. Plot (Y, r) pairs that satisfy equilibrium → **LM Curve**

### Step 3: Properties of LM Curve
- **Upward sloping**: Higher Y requires higher r to maintain MS/P = L(.)
- **Along the curve**: MS, P, and L(.) are constant
  - Y and r move in opposite directions within L(.) to keep L(.) constant
  - Effect of Y on L(.) must dominate effect of r on L(.)

## Shifting the LM Curve

### Rightward Shifts (LM moves down/right) - Expansionary
**Occurs when MS > MD at original equilibrium:**
- **MS increases** (central bank injects money)
- **πᵉ rises** (reduces demand for cash)
- **riskₐₗₜ falls** (other assets less risky)
- **liqₐₗₜ rises** (other assets more liquid)

### Leftward Shifts (LM moves up/left) - Contractionary
**Occurs when MS < MD at original equilibrium:**
- **MS decreases** (central bank withdraws money)
- **πᵉ falls** (increases demand for cash)
- **riskₐₗₜ rises** (other assets riskier)
- **liqₐₗₜ falls** (other assets less liquid)

### Price Level Changes
- **P falls** → MS/P rises → LM shifts right (down)
- **P rises** → MS/P falls → LM shifts left (up)
- Note: Graph setup uses MS/P on x-axis to show how P affects equilibrium through r

## Central Bank Policy Transmission

### Mechanism
1. Central bank changes MS (via tools described below)
2. At unchanged r, MS ≠ MD
3. Interest rate adjusts to restore equilibrium
4. New equilibrium affects investment, consumption → shifts along IS curve
5. New general equilibrium at intersection of new LM with IS and FE

---

# Equations, Variables, and Parameters

## Core Equilibrium Condition
```
MS/P = L(Y, r, πᵉ, W, riskₐₗₜ, liqₐₗₜ, payment_tech)
```

## Money Supply and Inflation Relationship
```
MS/P = L(.)/P
```
Rearranging:
```
MS = P × L(.)
```

**Implication**: If MS increases while L(.) is fixed (determined by real economy), then P must rise proportionally → **Inflation**

"Too many dollars chasing too few goods"

## Taylor Rule (Alternative Policy Framework)
```
i = pTarget + rTarget + 0.5×(p - pTarget) + 0.5×gap
```

Where:
- **i** = nominal Federal Funds Rate
- **p** = inflation over previous four quarters
- **gap** = percent deviation of output from full-employment output
- **pTarget** = target inflation rate (usually 0.02 or 2%)
- **rTarget** = target real interest rate (usually 0.02 or 2%)

## Nominal GDP Targeting (Alternative Framework)
```
Nominal GDP growth target = Real output growth + Target inflation
                          ≈ 2.5% + 2% = 4.5%
```

## Variables Summary Table

| Symbol | Definition | Type |
|--------|------------|------|
| Y | Real GDP | Endogenous |
| r | Real interest rate | Endogenous |
| P | Price level | Endogenous (long-run); Exogenous (short-run in LM derivation) |
| MS | Money supply | Exogenous (policy variable) |
| MD | Money demand | Endogenous |
| L(.) | Real money demand function | Functional form |
| πᵉ | Expected inflation | Exogenous/Expectations |
| W | Wealth | Exogenous |
| riskₐₗₜ | Riskiness of alternatives | Exogenous |
| liqₐₗₜ | Liquidity of alternatives | Exogenous |

---

# Rules, Constraints, and Assumptions

## Key Assumptions

### For LM Curve Derivation
1. **Price level (P) is fixed** during initial derivation
   - Allows focus on real money supply/demand
   - Relaxed later to show how P shifts LM

2. **Money supply (MS) is exogenous**
   - Controlled by central bank
   - Notation: "MS = Powell" (current Fed Chair)

3. **Central bank targets price stability**
   - Manipulates MS to prevent excessive inflation
   - U.S. Fed has dual mandate: price stability + full employment

4. **Closed economy** (for this lecture)
   - No exchange rate considerations
   - Open economy covered in weeks 9-11

5. **Money demand elasticities are stable**
   - MD responds predictably to Y, r, and other factors
   - Empirical estimates: εY ≈ 2/3, εr ≈ -1/10

### For General IS-LM Model
1. **Three equilibrium conditions must hold simultaneously:**
   - Goods market: Y = C + I + G (IS curve)
   - Money market: MS/P = L(.) (LM curve)
   - Labor market: Y = YFE (FE curve)

2. **Movement along vs. shifts:**
   - Along LM: Y and r change, MS and P constant
   - Shifts in LM: MS or P changes

## Constraints

### Central Bank Constraints
- **Political independence varies** by country
  - U.S. Fed: governors serve 14-year terms (nominated by President, approved by Senate)
  - Regional Fed chiefs appointed by local boards
  - Fed Chair serves 4-year terms

- **Mandate constraints:**
  - Must balance price stability with employment goals (U.S. dual mandate)
  - Cannot always prevent inflation if politically constrained (Turkey, Zimbabwe examples)

### Economic Constraints
- **Zero lower bound**: Nominal interest rates cannot go significantly below zero
  - Limits conventional monetary policy effectiveness
  - May require unconventional tools (QE)

- **Inflation-unemployment tradeoff**: Aggressive inflation fighting may increase unemployment

## Rules and Relationships

### Money Demand Direction Rules
| Factor Increases | Money Demand | Reasoning |
|------------------|--------------|-----------|
| Y (income) | Rises | More transactions |
| r (interest rate) | Falls | Higher opportunity cost of cash |
| W (wealth) | Rises | More precautionary/transaction demand |
| πᵉ (expected inflation) | Falls | Cash loses value; prefer real assets |
| riskₐₗₜ | Rises | Cash relatively safer |
| liqₐₗₜ | Falls | Fewer good substitutes for cash |
| Payment tech (e.g., ATMs) | Falls | Less need for cash on hand |

### LM Curve Properties
- **Slope**: Positive (upward sloping in r-Y space)
- **At any point on LM**: MS/P = L(.) holds
- **Movement along LM**: Y and r change; MS, P, and L(.) constant
  - Requires Y and r effects on L(.) to offset each other
  - Y effect must dominate r effect

---

# UI/UX and Interaction Requirements (if any)

## Presentation Notes
- **Document contains animations** designed to show:
  - How curves are constructed step-by-step
  - How curves shift in response to shocks
- **Best viewed in presentation mode** rather than canvas/reading mode
- Animations facilitate understanding of dynamic relationships

## Graphical Conventions

### Standard Graph Setup for Money Market
- **X-axis**: MS/P, L (real money supply and demand)
- **Y-axis**: r (real interest rate)
- **Downward-sloping curve**: L(Y) for given income level
- **Vertical line**: MS/P (exogenous money supply)

### Standard Graph Setup for LM Curve
- **X-axis**: Y (real GDP)
- **Y-axis**: r (real interest rate)
- **Upward-sloping curve**: LM curve
- **Downward-sloping curve**: IS curve (when shown)
- **Vertical line**: FE curve (when shown)

### Color/Notation Conventions
- Subscripts (0, 1, 2, 3) indicate sequential states
- Shifts shown with multiple curves labeled by state or parameter value

---

# Technical Requirements and Integration Notes

## Data Sources Required
- **Federal Reserve publications:**
  - Monetary aggregates (M1, M2)
  - Federal Funds Rate
  - Balance sheet data
  - FOMC meeting minutes and press releases

- **Economic indicators:**
  - Real GDP (Y) from BEA
  - CPI/Price level (P) from BLS
  - Inflation expectations (various sources: surveys, TIPS spreads)

## Integration with Other Model Components

### IS Curve (Previous Lecture)
- **Relationship**: LM and IS intersect to determine equilibrium (r, Y)
- **IS represents**: Goods market equilibrium (S = I in closed economy)
- **Interaction**: Changes in MS shift LM → movement along IS → new equilibrium

### FE Curve (Future Lecture)
- **Represents**: Full employment level of GDP
- **General equilibrium**: Requires IS, LM, and FE to intersect at same point
- **If not at FE**: Economy has unemployment or overheating

### Future Topics Integration
- **Week 5**: Unemployment
- **Week 6**: Complete IS-LM model
- **Week 7**: Supply shocks
- **Week 8**: Demand shocks/Keynesian analysis
- **Weeks 9-11**:

### 05_unemployment_kd.pdf

# Executive Summary

This document is a lecture presentation on unemployment from a macroeconomic analysis course (MGT 425) at Yale School of Management. It focuses on labor market dynamics, the natural rate of unemployment, the Phillips Curve relationship between unemployment and inflation, and the Full Employment (FE) curve in the IS-LM-FE macroeconomic model. The material establishes that unemployment rates signal economic health, influence Federal Reserve policy decisions, and create inflationary or deflationary pressures depending on whether actual unemployment is above or below the natural rate. Key concepts include frictional vs. structural unemployment, the expectations-augmented Phillips Curve, and Okun's Law relating output gaps to unemployment.

---

# Purpose and Scope

- **Primary Purpose**: Educate students on labor market dynamics and the role of unemployment in macroeconomic equilibrium
- **Scope**: 
  - Define and measure unemployment and labor force participation
  - Explain causes and types of unemployment (frictional vs. structural)
  - Introduce the natural rate of unemployment concept
  - Establish the Full Employment (FE) curve as part of the IS-LM-FE framework
  - Connect unemployment to inflation via the Phillips Curve
  - Provide policy context for Federal Reserve decision-making
- **Context**: Part 5 of a 13-topic macroeconomic analysis course; builds on prior topics (measurement, productivity, saving, money) and leads to IS-LM equilibrium analysis
- **Audience**: Graduate-level management students

---

# Key Concepts and Definitions

## Labor Market Definitions
- **Civilian Non-Institutional Population**: Total population eligible for labor force
- **Labor Force (LF)**: Employed + Unemployed persons
- **Employed**: Persons currently working
- **Unemployed**: Not employed AND searched for work in last 30 days
- **Not in Labor Force (NILF)**: Population not employed and not searching

## Key Ratios
- **Unemployment Rate (u)**: Unemployed / Labor Force
- **Labor Force Participation Rate**: (Unemployed + Employed) / (LF + NILF)

## Unemployment Types
- **Frictional Unemployment**: Short-term unemployment from workers/firms searching for best match; takes time to find each other and determine match quality
- **Structural Unemployment**: Long-term "chronic" unemployment from fundamental mismatch between worker skills and firm needs (e.g., sectoral shifts like manufacturing → services, or geographical mismatches)

## Natural Rate of Unemployment (u<sub>Natural</sub>)
- The unemployment rate expected given ongoing frictional and structural forces
- The rate around which the economy pivots as it heats up or cools down
- Unemployment would not be expected to fall to zero due to these persistent forces

## Full Employment Output (Y<sub>FE</sub>)
- The level of GDP achieved when economy is at u<sub>Natural</sub>
- The level of GDP the economy is "comfortable" producing
- Represents short-run possibilities before today's investment becomes tomorrow's capital
- Not "too cold" and not "too hot"

## Phillips Curve
- Negative relationship between unemployment and wage growth/inflation (Philips 1958, UK data 1861-1957)
- Modern version: surprises in unemployment relate to inflation expectations
- **Expectations-Augmented Phillips Curve**: π - π<sup>e</sup> = -f(u - u<sub>Natural</sub>)
  - Un-natural unemployment gives rise to unexpected inflation

## NAIRU
- **Nonaccelerating Inflation Rate of Unemployment**: The unemployment rate below which inflation begins to accelerate
- Closely related to natural rate concept
- Fed estimates long-run range of 5.2%-5.5% (as of document timeframe)

## Okun's Law (1962)
- **(Y - Y<sub>FE</sub>)/Y = -2.5(u - u<sub>N</sub>)**
- Relates output gap to unemployment gap
- Economy must grow ~2.5% annually just to keep unemployment from rising (to offset productivity and population growth)
- Two extra points of growth over a year needed to reduce unemployment by one point

---

# Inputs, Outputs, and Data Dependencies

## Data Inputs
- **Labor Market Statistics** (monthly):
  - Civilian non-institutional population
  - Labor force size
  - Number employed
  - Number unemployed
  - Not in labor force
  - Source: Bureau of Labor Statistics (www.bls.gov)
  
- **Historical Data Points Cited**:
  - Feb 2020: 164M LF, 5.7M unemployed, 3.5% unemployment rate, 63.0% participation
  - Feb 2021: 160M LF, 10.0M unemployed, 6.2% unemployment rate, 61.4% participation
  - Mar 2022: 164M LF, 6.2M unemployed, 3.8% unemployment rate, 62.4% participation
  - Mar 2024: 168M LF, 6.4M unemployed, 3.8% unemployment rate, 62.5% participation

- **Job Growth Data** (AP Mar 7, 2025 article):
  - 2021: 603,000 jobs/month average (record, post-COVID rebound)
  - 2022: 380,000 jobs/month average
  - 2023: 216,000 jobs/month average
  - 2024: 168,000 jobs/month average

- **Inflation Data**: 
  - September 2024: 2.4% inflation rate

- **Fed Policy Data**:
  - 11 interest rate increases in 2022-2023 (to highest level in 20+ years)
  - 3 rate cuts in 2024

## Model Dependencies
- **Current Capital Stock (K)**: Determined by yesterday's investment
- **Current Total Factor Productivity (A)**: Technology/efficiency level
- **Labor Supply (L<sup>S</sup>)**: Function of wages, future wages, interest rates, tax policy, effort
- **Labor Demand (L<sup>D</sup>)**: Function of wages and marginal product of labor (MPL)

## Outputs
- **Unemployment rate**: Key indicator of economic health
- **Full Employment GDP (Y<sub>FE</sub>)**: Equilibrium output level
- **Inflationary/deflationary pressure signals**: Based on u vs. u<sub>Natural</sub>
- **Policy recommendations**: Fed interest rate adjustments

---

# Process / Model Logic

## Labor Market Equilibrium Process
1. **Capital determined**: K today comes from I (investment) yesterday
2. **Firms decide labor demand**: Given K today and current TFP (A), firms determine how much labor to hire
3. **Labor market clears**: L<sup>S</sup> = L<sup>D</sup> at equilibrium wage
4. **Output determined**: Y<sub>FE</sub> results from production function with equilibrium K and L

## Unemployment Dynamics
1. **Continuous flows**: Workers and firms constantly searching for matches
2. **Frictional component**: Time required for matching and quality assessment
3. **Structural component**: Persistent mismatches (skills, geography, sectors)
4. **Natural rate emerges**: Equilibrium between flows into and out of unemployment

## Economic Heating/Cooling Logic
- **If u < u<sub>Natural</sub>** (equivalently Y > Y<sub>FE</sub>):
  - Labor markets are "tight"
  - Economy is overheated
  - Firms must raise wages to fill positions
  - Pressure for prices to rise → **Inflation**
  
- **If u > u<sub>Natural</sub>** (equivalently Y < Y<sub>FE</sub>):
  - Labor markets are "slack"
  - Economy is underheated
  - Firms don't need to pay much to fill positions
  - Pressure for prices to fall → **Deflation**

## IS-LM-FE Integration
1. **IS Curve**: Goods market equilibrium (S = I)
2. **LM Curve**: Asset/money market equilibrium (M<sup>S</sup> = M<sup>D</sup>)
3. **FE Curve**: Full employment equilibrium (u = u<sub>Natural</sub>)
4. **General Equilibrium**: Intersection of all three curves yields one interest rate with all markets in equilibrium

---

# Equations, Variables, and Parameters

## Core Equations

### Production Function
- **Y = A K<sup>α</sup> L<sup>(1-α)</sup>**
  - Y = output/GDP
  - A = total factor productivity
  - K = capital stock
  - L = labor
  - α = capital share parameter

### Labor Market
- **L<sup>D</sup> = f(w, MPL)**
  - Labor demand depends on wage (w) and marginal product of labor
- **L<sup>S</sup> = f(w, w<sup>F</sup>, r, tax policy)**
  - Labor supply depends on current wage, future wage, interest rate, tax policy
- **Equilibrium: L<sup>S</sup> = L<sup>D</sup>**

### Unemployment Metrics
- **Unemployment Rate: u = Unemployed / (Employed + Unemployed)**
- **Labor Force Participation = (Employed + Unemployed) / (LF + NILF)**

### Phillips Curve (Expectations-Augmented)
- **π - π<sup>e</sup> = -f(u - u<sub>Natural</sub>)**
  - π = actual inflation
  - π<sup>e</sup> = expected inflation
  - u = actual unemployment rate
  - u<sub>Natural</sub> = natural rate of unemployment
  - Unexpected inflation = negative function of un-natural unemployment

### Okun's Law
- **(Y - Y<sub>FE</sub>)/Y = -2.5(u - u<sub>N</sub>)**
  - Output gap (as % of Y) = -2.5 × unemployment gap
  - Coefficient of -2.5 is empirical estimate
  - Implies ~2.5% growth needed to maintain constant unemployment
  - 2 percentage points of extra growth needed to reduce unemployment by 1 point

### Money Market (from prior topics)
- **M<sup>S</sup> = Central Bank** (money supply set by central bank)
- **M<sup>D</sup> = P × L(Y, r, π<sup>e</sup>, risk<sub>alt</sub>, liquidity<sub>alt</sub>, technology)**
  - Money demand depends on price level, output, interest rate, expected inflation, alternative asset characteristics
- **Equilibrium: M<sup>S</sup> = M<sup>D</sup>**

### Saving-Investment (from prior topics)
- **S = f(r, Y, Y<sup>F</sup>, Wealth)**
- **I = f(MPK<sup>F</sup>, r, depreciation, taxes)**
- **Equilibrium: S = I**

### National Income Identity
- **Y = C + I + G + X - M**
  - C = consumption
  - I = investment
  - G = government spending
  - X = exports
  - M = imports

## Variable Definitions
- **W** = wealth
- **w** = wage
- **r** = real interest rate
- **L** = labor
- **L(.)** = real demand for money (function)
- **Y<sub>FE</sub>** = full employment GDP
- **u<sub>Natural</sub>** = natural rate of unemployment
- **MPL** = marginal product of labor
- **MPK** = marginal product of capital

---

# Rules, Constraints, and Assumptions

## Definitional Rules
- **Unemployed status requires**: Not employed AND actively searched for work in last 30 days
- **Labor Force = Employed + Unemployed** (excludes NILF)
- **Total Population = Labor Force + Not in Labor Force**

## Economic Assumptions
- **Unemployment never reaches zero**: Frictional and structural forces always present
- **Natural rate is stable pivot point**: Economy fluctuates around u<sub>Natural</sub>
- **FE curve is vertical**: Full employment output does not depend on interest rate
  - Determined by current K and current L
  - K today comes from I yesterday (timing assumption)

## Phillips Curve Assumptions
- **Negative relationship**: Lower unemployment → higher inflation (and vice versa)
- **Expectations matter**: Must adjust for expected inflation (π<sup>e</sup>)
- **Deviations from natural rate matter**: Must measure (u - u<sub>Natural</sub>), not just u
- **Relationship can shift**: Due to supply shocks, expectations changes, structural factors
- **Historical instability**: 1970s showed high u AND high π (stagflation), violating simple Phillips curve

## Policy Constraints
- **Fed targets inflation**: Uses unemployment as signal of inflationary pressure
- **Humphrey-Hawkins Act (1978)**: Required government to pursue full employment
  - Target: <3% unemployment for persons over 20
  - Target: <4% unemployment for persons over 16
- **Fed estimates of natural rate**: 5.2%-5.5% long-run range (as of document period)

## Okun's Law Parameters
- **Growth threshold**: ~2.5% annual growth needed to prevent unemployment from rising
  - Accounts for productivity growth and population growth
- **Sensitivity**: 2 points of extra growth required to reduce unemployment by 1 point over a year

## FE Curve Shift Factors
**FE curve shifts RIGHT if:**
- Current TFP rises (A↑)
- Labor supply rises (L<sup>S</sup>↑) due to:
  - Increased effort
  - Tax policy changes favoring work
  - Other factors increasing participation

**FE curve shifts LEFT if:**
- Current TFP falls (A↓)
- Labor supply falls (L<sup>S</sup>↓)
- Capital stock falls (K↓) (e.g., earthquake, disaster)

---

# UI/UX and Interaction Requirements (if any)

**Not applicable** - This is a lecture document with no software UI/UX requirements. 

However, the document references:
- **Technology platforms for job matching**: Collegefeed example (2014) using software to reduce frictional unemployment by matching college students with employers
  - Emphasizes accomplishments in worker profiles
  - Works with employers to refine desired qualities
  - Software does preliminary matching
  - Human review before sending matches to employer
  - Goal: Make hiring process cheaper and more efficient

---

# Technical Requirements and Integration Notes

## Data Sources and Systems
- **Bureau of Labor Statistics (BLS)**: www.bls.gov
  - Monthly labor force statistics
  - Historical unemployment data back to 1948
  - Inflation data
- **Historical Statistics**: Historical Abstract of the United States (Table D1-10) for 1900-1947 data
- **OECD**: Estimates of potential output for international comparisons
- **IMF**: Alternative estimates of potential output
- **World Bank**: Cross-country evidence on labor market flows

## Model Integration Points
- **IS-LM-FE Framework**: FE curve must integrate with:
  - IS curve (goods market equilibrium)
  - LM curve (money market equilibrium)
  - Intersection determines general equilibrium interest rate and output

## Calculation Requirements
- **Unemployment rate calculation**: Requires accurate counts of employed and unemployed
- **Labor force participation calculation**: Requires total population data
- **Output gap calculation**: Requires estimates of both actual Y and Y<sub>FE</sub>
- **Natural rate estimation**: Complex econometric problem with wide uncertainty
  - WSJ survey (2015): Economists estimate anywhere from 4% to 6%
  - Requires judgment about structural vs. cyclical factors

## Forecasting Challenges
- **Lucas Critique (1995 Nobel)**: Policy actions change private sector behavior
  - Historical relationships (like Phillips Curve) may break down when exploited
  - Makes forecasting very difficult
  - Policies may not work as expected if agents anticipate them

---

# Risks, Ambiguities, and Missing Information

## Ambiguities and Uncertainties

### Natural Rate Estimation
- **Question**: What is the precise natural rate of unemployment for the U.S.?
  - Document shows wide range of expert estimates (4%-6% per WSJ 2015)
  - Fed estimates 5.2%-5.5% but considers revising downward
  - No consensus methodology provided

### Phillips Curve Stability
- **Question**: Why did the Phillips Curve relationship break down in the 1

### 06_islm_kd.pdf

# Executive Summary

This document is a lecture slide deck for MGT 425: Macroeconomic Analysis, Topic 6: IS + LM = ISLM, taught by Kevin Donovan at Yale School of Management. It introduces the ISLM macroeconomic model, which integrates three equilibrium conditions: the IS curve (goods market equilibrium where savings equals investment), the LM curve (money/asset market equilibrium where money supply equals money demand), and the FE curve (full employment GDP). The model is used to analyze how fiscal and monetary policy shocks affect real GDP (Y), real interest rates (r), and price levels (P). Key applications include analyzing government spending increases, tax cuts, money supply changes, and productivity shocks. The document emphasizes that general equilibrium occurs where all three curves intersect, and that deviations from full employment create inflationary or deflationary pressures that adjust the economy back toward equilibrium.

---

# Purpose and Scope

## Purpose
- Teach students to use the ISLM framework to analyze macroeconomic equilibria and policy impacts
- Enable students to translate real-world economic news and policy debates into formal ISLM analysis
- Demonstrate how goods markets, money markets, and labor markets interact simultaneously
- Explain the relationship between output gaps (Y vs. YFE) and price level changes

## Scope
- **In scope:**
  - Construction and interpretation of IS, LM, and FE curves
  - Analysis of fiscal shocks (government spending, taxes)
  - Analysis of monetary shocks (money supply changes)
  - Analysis of productivity and supply-side shocks
  - Price level adjustment mechanisms
  - General equilibrium analysis
  - Application to contemporary policy debates (Trump administration policies, European fiscal expansion, Turkey monetary policy)

- **Out of scope:**
  - Open economy extensions (covered in later topics 9-11)
  - Detailed exchange rate mechanics
  - Long-run growth models beyond TFP shocks
  - Detailed empirical econometrics (though empirical evidence on Ricardian Equivalence is discussed)

---

# Key Concepts and Definitions

## Core Variables (from Glossary)
- **Y**: Real GDP = income = expenditures = output
- **r**: Real interest rate (market rate set by banks, influenced but not set by monetary policy)
- **P**: Price level
- **C**: Consumption
- **I**: Investment
- **G**: Government consumption and investment
- **S**: Saving (total)
- **SP**: Private saving
- **SG**: Public/government saving = T - G
- **MS**: Nominal money supply
- **L(.)**: Real money demand (function of Y and r)
- **A**: Total Factor Productivity (TFP)
- **K**: Capital stock
- **L**: Labor
- **LD**: Labor demand
- **LS**: Labor supply
- **w**: Real wage
- **YFE**: Full employment GDP (output when unemployment = natural rate)
- **U**: Unemployment rate
- **uNatural**: Natural rate of unemployment
- **YF**: Future income
- **AF**: Future TFP
- **pe**: Expected inflation
- **riskalt**: Riskiness of non-cash assets
- **liqalt**: Liquidity of non-cash assets

## Three Equilibrium Curves

### IS Curve (Goods Market)
- Represents combinations of (Y, r) where **I = S** (investment equals saving)
- Downward sloping: higher r reduces I, requiring lower Y (and thus lower S) to maintain equilibrium
- Each point represents goods market equilibrium at different income levels

### LM Curve (Money/Asset Market)
- Represents combinations of (Y, r) where **MS/P = L(Y, r)** (real money supply equals real money demand)
- Upward sloping: higher Y increases money demand (more transactions), requiring higher r to reduce money demand back to fixed supply
- Each point represents asset market equilibrium

### FE Curve (Full Employment)
- Vertical line at **YFE**
- Represents output level when labor market is at natural rate of unemployment
- Does not depend on r (current investment doesn't become capital until future periods)

## General Equilibrium
- Occurs at intersection of all three curves: IS ∩ LM ∩ FE
- Represents simultaneous equilibrium in goods market, money market, and sustainable employment level
- One interest rate, all markets clear

## Price Adjustment Mechanism
- **Y > YFE**: Economy "too hot" → labor markets tight → upward wage pressure → **P rises**
- **Y < YFE**: Economy has "slack" → unemployment above natural rate → downward wage pressure → **P falls**
- **Y = YFE**: No pressure for price changes

## Money Neutrality
- If prices adjust very rapidly to money supply changes, monetary policy affects only P, not real variables (Y, r)
- Represents long-run outcome where MS increase shifts LM right temporarily, but P rises proportionally, shifting LM back to original position

## Ricardian Equivalence
- Theory that government deficit spending doesn't boost demand because consumers save more in anticipation of future tax increases
- If SG falls (deficit rises), SP rises by equal amount, leaving total S unchanged
- Empirical evidence is mixed (discussed for 2001 and 2008 tax cuts)

---

# Inputs, Outputs, and Data Dependencies

## Model Inputs

### Exogenous Policy Variables
- **G**: Government spending
- **T**: Taxes (affects SG = T - G)
- **MS**: Nominal money supply (central bank policy)

### Exogenous Economic Fundamentals
- **A**: Current TFP
- **AF**: Future/expected TFP
- **K**: Current capital stock
- **YF**: Expected future income
- **Wealth**: Household wealth
- **pe**: Expected inflation
- **riskalt**: Risk of alternative (non-cash) assets
- **liqalt**: Liquidity of alternative assets
- **P**: Price level (adjusts endogenously but can be treated as input for short-run analysis)

### Structural Parameters
- Labor supply function parameters (effort, tax policy effects)
- Production function parameters (MPL, MPK)
- Saving behavior parameters
- Money demand function parameters

## Model Outputs

### Endogenous Variables
- **Y**: Equilibrium real GDP
- **r**: Equilibrium real interest rate
- **P**: Price level (adjusts to bring economy to FE)
- **I**: Investment (determined by r and expectations)
- **S**: Total saving (determined by Y and SG)
- **C**: Consumption (residual from Y = C + I + G identity)
- **w**: Real wage (adjusts with labor market conditions)
- **U**: Unemployment rate

### Equilibrium States
- Short-run equilibrium: IS ∩ LM (may not be at FE)
- Long-run/general equilibrium: IS ∩ LM ∩ FE
- Inflationary/deflationary pressure indicators

## Data Dependencies

### For Empirical Application
- Real GDP data (to assess position relative to YFE)
- Unemployment rate (to assess position relative to uNatural)
- Inflation/price level data
- Interest rate data
- Government budget data (G, T, deficits)
- Money supply data
- Productivity/TFP estimates
- Labor force participation data

### Referenced Data Sources
- FRED (Federal Reserve Economic Data)
- Congressional Budget Office (CBO) potential GDP estimates
- TURKSTAT (Turkish statistical agency for inflation example)

---

# Process / Model Logic

## ISLM Recipe (Step-by-Step Analysis Framework)

1. **Start at General Equilibrium (GE)**
   - Identify initial position where IS ∩ LM ∩ FE
   - Note initial (Y₀, r₀, P₀)

2. **Identify Shock(s)**
   - Determine which exogenous variable(s) changed
   - Examples: A falling, G rising, MS rising, AF rising, T falling

3. **Move Appropriate Curve(s)**
   - Determine which curve(s) shift based on shock
   - Determine direction of shift

4. **Determine New Short-Run Equilibrium**
   - Find where IS and LM now intersect
   - Note new (Y₁, r₁)

5. **Assess Price Pressure**
   - Compare Y₁ to YFE
   - **If Y₁ > YFE**: P rises (inflationary pressure)
   - **If Y₁ < YFE**: P falls (deflationary pressure)
   - **If Y₁ = YFE**: P stays same (already at GE)

6. **Move LM Curve to Adjust Prices (if necessary)**
   - If P changes, MS/P changes in opposite direction
   - LM shifts: P↑ → MS/P↓ → LM shifts left/up
   - LM shifts: P↓ → MS/P↑ → LM shifts right/down

7. **Find New General Equilibrium**
   - Determine where economy settles after price adjustment
   - Verify IS ∩ LM ∩ FE

8. **Done**

## IS Curve Construction Logic

1. Start with goods market equilibrium: **S(Y) = I(r, AF, YF, ...)**
2. For given Y₀, find r₀ that equilibrates S and I
3. Increase Y to Y₁ → S increases → r must fall to increase I back to equality
4. Plot (Y₀, r₀), (Y₁, r₁), etc. → downward sloping IS curve
5. Curve traces all (Y, r) combinations where I = S

## LM Curve Construction Logic

1. Start with money market equilibrium: **MS/P = L(Y, r)**
2. Hold P fixed; for given Y₀, find r₀ that equilibrates MS/P and L(.)
3. Increase Y to Y₁ → L(.) increases (more transactions) → r must rise to reduce L(.) back to MS/P
4. Plot (Y₀, r₀), (Y₁, r₁), etc. → upward sloping LM curve
5. Curve traces all (Y, r) combinations where MS/P = L(.)

## FE Curve Construction Logic

1. Determine labor market equilibrium: LS = LD at natural unemployment rate
2. Calculate YFE from production function: YFE = F(A, K, L*) where L* is equilibrium labor
3. Plot vertical line at YFE (independent of r)

## Price Adjustment Dynamics

### When Y > YFE (Economy "Too Hot")
1. Firms need more workers than available at natural unemployment
2. Competition for workers drives wages up
3. Higher wages increase production costs
4. Firms raise prices → P increases
5. MS/P decreases (real money supply falls)
6. LM curve shifts left/up
7. Higher r reduces I and Y
8. Process continues until Y returns to YFE

### When Y < YFE (Economy Has "Slack")
1. Unemployment above natural rate
2. Downward pressure on wages
3. Lower production costs
4. Firms lower prices → P decreases
5. MS/P increases (real money supply rises)
6. LM curve shifts right/down
7. Lower r increases I and Y
8. Process continues until Y returns to YFE

---

# Equations, Variables, and Parameters

## Core Equilibrium Conditions

### Goods Market (IS Curve)
```
S(Y, SG, Wealth, YF) = I(r, AF, YF, tax policy)
```
Where:
- S increases with Y (higher income → higher saving)
- S decreases with SG (government saving crowds out need for private saving)
- S decreases with Wealth (wealthier people save less from current income)
- S increases with YF (higher future income → save less today)
- I decreases with r (higher cost of capital)
- I increases with AF (higher future productivity → higher return to investment)
- I increases with YF (higher future demand)

### Money Market (LM Curve)
```
MS/P = L(Y, r, pe, riskalt, liqalt)
```
Where:
- L increases with Y (more transactions demand)
- L decreases with r (higher opportunity cost of holding cash)
- L decreases with pe (expected inflation reduces real value of cash)
- L increases with riskalt (riskier alternatives → prefer cash)
- L decreases with liqalt (more liquid alternatives → less need for cash)

### Labor Market (FE Curve)
```
LS(w, tax policy, effort) = LD(w, A, K)
YFE = F(A, K, L*)
```
Where:
- L* is equilibrium labor at natural unemployment
- LS increases with w (higher wage → more labor supplied)
- LD decreases with w (higher wage → less labor demanded)
- YFE increases with A (productivity)
- YFE increases with K (capital stock)

## National Income Identity
```
Y = C + I + G + (X - M)
```
For closed economy (ignoring X, M, NFP):
```
Y = C + I + G
```

## Saving Identity
```
S = SP + SG
SP = Y - T - C
SG = T - G
Therefore: S = Y - C - G
```

## Production Function (Implicit)
```
Y = F(A, K, L)
```
With marginal products:
- MPL = ∂F/∂L
- MPK = ∂F/∂K

## Real vs. Nominal
```
Real money supply = MS/P
Nominal money demand = MD = P × L(Y, r, ...)
Real money demand = L(Y, r, ...)
```

## Key Relationships

### IS Curve Slope
- **Negative**: ∂r/∂Y < 0 along IS curve
- Higher Y → higher S → r must fall to raise I

### LM Curve Slope
- **Positive**: ∂r/∂Y > 0 along LM curve
- Higher Y → higher L(.) → r must rise to reduce L(.) back to MS/P

### FE Curve Slope
- **Vertical**: ∂r/∂Y = undefined (infinite)
- YFE independent of r

---

# Rules, Constraints, and Assumptions

## Fundamental Assumptions

### Market Clearing
- Goods market clears along IS curve (I = S at each point)
- Money market clears along LM curve (MS/P = L at each point)
- Labor market clears at natural rate along FE curve

### Price Adjustment
- Prices are sticky in the short run (allows Y ≠ YFE temporarily)
- Prices adjust in medium/long run to bring Y back to YFE
- Speed of price adjustment determines how long economy stays away from FE

### Agent Behavior
- Firms and households respond to incentives (emphasized repeatedly)
- Investment responds negatively to interest rates
- Saving responds positively to income
- Money demand responds positively to income, negatively to interest rates

### Rational Expectations (Implicit)
- Agents form expectations about future variables (AF, YF, pe)
- These expectations influence current behavior (investment, saving, money demand)

## Constraints

### Full Employment Constraint
- Economy cannot sustainably operate above YFE without inflation
- Economy cannot sustainably operate below YFE without deflation
- **"This is the economic constraint imposed by the FE curve: Increasing MS, G comes at the cost of inflation"**

### Budget Constraints
- Government: SG = T - G (deficit if negative)
- Households: SP = Y - T - C
- Total saving: S = Y - C - G

### Money Market Constraint
- Real money supply is MS/P (fixed MS, adjustable P)
- Money demand must equal supply in equilibrium

### Production Constraint
- Output limited by F(A, K, L)
- Current investment doesn't affect current K (only future K)

## Rules for Curve Shifts

### IS Curve Shifts RIGHT (I > S) When:
- AF rises (future productivity up → more investment)
- YF rises (future income up → more investment, less saving)
- Wealth rises (less need to save)
- SG falls (G rises or T falls → less government saving)

### IS Curve Shifts LEFT (I < S) When:
- AF falls
- YF falls
- Wealth falls
- SG rises (G falls or T rises)

### LM Curve Shifts RIGHT/DOWN (MS/P >

### 07_supply_kd.pdf

# Executive Summary

This document is a lecture slide deck on **supply shocks** within the IS-LM macroeconomic framework (MGT 425, Topic 7). It explains how negative supply shocks (e.g., oil price increases, supply chain disruptions) reduce full-employment output (YFE), cause inflation, and lead to recession. A key finding is that **fiscal and monetary policy cannot restore GDP after a supply shock without causing additional inflation**—only reversing the underlying shock can restore output. The material uses the 1970s oil shocks and 2022 supply chain disruptions as case studies and emphasizes that the Federal Reserve's tools (interest rates, money supply) work on demand, not supply.

---

# Purpose and Scope

- **Purpose**: Teach students how to model and analyze supply shocks using the IS-LM framework and understand policy limitations.
- **Scope**:
  - Classification of recessions (supply vs. demand shocks; real vs. nominal shocks)
  - Mechanics of supply shocks in IS-LM equilibrium
  - Policy responses (fiscal and monetary) and their ineffectiveness
  - Real-world applications: 1970s oil shocks, Great Recession, 2022 inflation/supply chain issues
- **Audience**: Graduate-level macroeconomic analysis students (Yale School of Management)
- **Context**: Part of a 13-meeting course; follows IS-LM introduction (Topic 6) and precedes demand shocks (Topic 8)

---

# Key Concepts and Definitions

## Core Concepts
- **Supply Shock**: A shock that affects full-employment output (YFE), shifting the FE curve. Can be positive or negative.
- **Demand Shock**: A shock affecting goods or asset markets, shifting IS or LM curves.
- **Real Shock**: Affects IS or FE curves (e.g., productivity, wealth, government spending).
- **Nominal Shock**: Affects LM curve (e.g., money supply, price level).
- **Full-Employment Output (YFE)**: The "comfortable" level of output given capital (K), labor supply (LS), productivity (A), and natural unemployment (uNatural).

## IS-LM Framework Elements
- **IS Curve**: Represents equilibrium in goods market (Investment = Saving).
- **LM Curve**: Represents equilibrium in money market (Money Supply / Price = Liquidity Demand).
- **FE Curve**: Vertical line at full-employment output.

## Recession Classification
- **Supply Shock Recession**: FE curve shifts left → lower YFE, higher prices.
- **Demand Shock Recession**: IS or LM curve shifts left → lower output, variable price effects.

## Historical Examples
- **1970s Oil Shocks**: Negative supply shocks (oil price increases reduced productivity A).
- **Great Recession (2007-2009)**: Demand shock (housing wealth decline → reduced consumption/saving).
- **2022 Inflation**: Supply chain disruptions (China lockdowns, Ukraine war) = negative supply shock.

---

# Inputs, Outputs, and Data Dependencies

## Inputs to IS-LM Model
- **Exogenous Variables**:
  - **A** (productivity/technology)
  - **K** (capital stock)
  - **LS** (labor supply)
  - **uNatural** (natural unemployment rate)
  - **AF** (future productivity expectations)
  - **YF** (future income expectations)
  - **Wealth** (household wealth)
  - **G** (government spending)
  - **T** (taxes)
  - **MS** (money supply)
  - **P** (price level)
  - **pe** (expected inflation)
  - **riskalt**, **liqalt** (alternative asset risk/liquidity)

## Outputs
- **Equilibrium Values**:
  - **Y** (GDP/output)
  - **r** (real interest rate)
  - **P** (price level)
  - **Employment** (Emp)
  - **Consumption (C)**, **Investment (I)**, **Saving (S)**

## Data Dependencies
- Historical GDP growth data (BEA)
- Oil price data (1970s shocks)
- House price data (Shiller index for Great Recession)
- Inflation data (CPI or similar)
- Recession dating (NBER peak/trough definitions)

---

# Process / Model Logic

## IS-LM Recipe (General Equilibrium Analysis)
1. **Start at General Equilibrium (GE)**: IS, LM, and FE curves intersect.
2. **Identify Shock(s)**: Determine which exogenous variable changes (e.g., A↓).
3. **Move Appropriate Curve(s)**: Shift IS, LM, or FE based on shock.
4. **Determine New Intersection**: Where do IS and LM intersect after shift?
5. **Assess Price Pressure**:
   - If Y > YFE → P rises (economy overheating)
   - If Y < YFE → P falls (recession/slack)
   - If Y = YFE → P stable
6. **Adjust LM for Price Changes**: LM shifts as P changes (MS/P changes).
7. **Find New GE**: Iterate until IS, LM, FE align.

## Supply Shock Sequence (Negative)
1. **Shock**: A↓ (e.g., oil price spike reduces productivity)
2. **FE Curve Shifts Left**: FE0 → FE1 (YFE decreases)
3. **Initial Disequilibrium**: Economy at (Y0, r0), but Y0 > new YFE1
4. **Scarcity/Overheating**: Economy producing above new "comfortable" level
5. **Price Pressure**: P↑ (inflation)
6. **LM Shifts Left**: As P↑, MS/P↓, so LM0 → LM1
7. **Movement Along IS**: From (Y0, r0) to (Y1, r1) where Y1 < Y0 and r1 > r0
8. **New GE**: (Y1, r1) with lower output, higher interest rate, higher prices

## Effects of Supply Shock
- **Y↓** (recession)
- **r↑** (higher interest rates)
- **P↑** (inflation) → **stagflation** (recession + inflation)
- **I, S, C, Emp↓** (investment, saving, consumption, employment all fall)
- **L(.)↓** (money demand falls as Y↓ or r↑)

---

# Equations, Variables, and Parameters

## Key Relationships (Implicit)
- **Money Market Equilibrium**: MS = P × L(Y, r)
  - L(.) = liquidity demand function
  - L(.) increases with Y, decreases with r
- **Goods Market Equilibrium**: I(r, AF, YF, ...) = S(Y, G, T, Wealth, ...)
- **Full Employment**: YFE = f(K, LS, A, uNatural)

## Variables
- **Endogenous**: Y, r, P, C, I, S, Emp
- **Exogenous**: A, K, LS, uNatural, AF, YF, Wealth, G, T, MS, pe, riskalt, liqalt

## Parameters (Not Explicitly Defined)
- Elasticities of I and S with respect to r, Y, etc.
- Functional forms of L(.), I(.), S(.) not specified

---

# Rules, Constraints, and Assumptions

## IS Curve Shift Rules
- **Shifts Right** (I > S):
  - AF↑, YF↑, Wealth↑, SG↓, G↑, T↓
- **Shifts Left** (I < S):
  - AF↓, YF↓, Wealth↓, SG↑, G↓, T↑

## LM Curve Shift Rules
- **Shifts Right** (MS/P > L(.)):
  - MS↑, pe↑, riskalt↓, liqalt↑, P↓
- **Shifts Left** (MS/P < L(.)):
  - MS↓, pe↓, riskalt↑, liqalt↓, P↑

## FE Curve Shift Rules
- **Shifts Right**: K↑, LS↑, A↑, uNatural↓
- **Shifts Left**: K↓, LS↓, A↓, uNatural↑

## Constraints
- **Price Adjustment**: Prices adjust to bring economy to FE in long run.
- **Money Equilibrium**: MS = P × L(Y, r) must hold.
- **Goods Equilibrium**: I = S must hold along IS curve.

## Assumptions
- **Agents Respond to Incentives**: Curve movements reflect rational behavior.
- **Price Flexibility**: Prices adjust to eliminate disequilibrium (eventually).
- **Closed Economy** (for this topic; open economy covered later in course).
- **No Policy Can Change YFE Directly**: Only reversing the underlying shock (e.g., restoring A) can restore full-employment output.

## Key Policy Constraint
- **Fiscal Expansion (G↑)**: Shifts IS right → further inflation, no sustained Y increase (returns to new YFE).
- **Monetary Expansion (MS↑)**: Shifts LM right → further inflation, no sustained Y increase.
- **Conclusion**: "Loose fiscal or monetary policy can't restore GDP—only cause more inflation."

---

# UI/UX and Interaction Requirements (if any)

## Presentation Features
- **Animations**: Slides contain animations showing how curves shift and move. Recommended to view outside Canvas for full effect.
- **Spider Graphs**: Cumulative abnormal GDP growth graphs showing recession dynamics over quarters from peak.
- **Color Coding**: Different recessions color-coded in comparative graphs.

## Pedagogical Elements
- **Step-by-step Curve Shifts**: Visual progression from initial equilibrium through shock to new equilibrium.
- **Highlighted Text**: Key points in news articles highlighted to connect theory to real-world events.
- **Comparative Analysis**: Side-by-side graphs of different recessions (1970s oil shocks, Great Recession, 2022).

---

# Technical Requirements and Integration Notes

## Data Sources
- **GDP Data**: Bureau of Economic Analysis (www.bea.gov)
- **House Price Data**: Robert Shiller's house price index
- **Graphs**: Created by Stata program `contributions.do`

## Analytical Tools
- **IS-LM Graphical Framework**: Standard 2-axis (Y, r) diagrams with three curves.
- **Business Cycle Analysis**:
  - Peak/trough identification
  - Detrending (normal vs. abnormal growth)
  - Cumulative abnormal GDP growth calculations
  - Component decomposition (residential, durables, equipment, etc.)

## Integration with Course
- **Prerequisites**: Topics 1-6 (Measurement, Productivity, Saving, Money, Unemployment, IS-LM)
- **Follow-on Topics**: Topic 8 (Demand Shocks/Keynesians), Topics 9-11 (Open Economy Macro)
- **Textbook References**: ABC chapters 1-4, 7, 9.2, 9.3, 12

---

# Risks, Ambiguities, and Missing Information

## Ambiguities
- **Magnitude of Shocks**: No quantitative guidance on how much A, P, or other variables change in response to specific shocks (e.g., "oil price doubles → A falls by X%").
- **Functional Forms**: L(.), I(.), S(.) functions not specified—only directional relationships given.
- **Time Dynamics**: How quickly prices adjust (LM shifts) is unclear. Model appears static/comparative statics rather than dynamic.
- **Threshold Effects**: When does "overheating" trigger price increases? No explicit rule.

## Missing Information
- **Quantitative Parameters**: No elasticities, slopes, or numerical values for any relationships.
- **Policy Lag Structures**: How long do fiscal/monetary policies take to affect economy?
- **Expectations Formation**: How are AF, YF, pe formed? Adaptive? Rational?
- **Labor Market Details**: How does employment (Emp) relate to Y and uNatural?
- **International Linkages**: Supply chain disruptions involve global trade, but model is closed-economy.

## Questions for Clarification
- **Q1**: What is the precise functional form of YFE = f(K, LS, A, uNatural)? Cobb-Douglas?
- **Q2**: How is "overheating" (Y > YFE) quantitatively defined? Any threshold?
- **Q3**: What is the speed of price adjustment? Instantaneous or gradual?
- **Q4**: How do supply chain disruptions map to A in the model? Is it a temporary or permanent shock?
- **Q5**: Can microeconomic interventions (e.g., fixing supply chains) be modeled as reversing A↓?
- **Q6**: What is SG (mentioned in IS shift rules)? Government saving?
- **Q7**: How does the model handle simultaneous supply and demand shocks (e.g., 2022: supply chains + fiscal stimulus)?

## Risks
- **Oversimplification**: Real-world supply shocks may have demand-side effects (e.g., oil shock → wealth transfer → consumption changes).
- **Policy Misapplication**: Policymakers may attempt fiscal/monetary stimulus despite model's warning, leading to stagflation.
- **Empirical Fit**: Historical data (1970s) may not generalize to modern economy (e.g., different energy dependence, monetary regimes).
- **Expectation Effects**: If agents expect policy response, behavior may change (Lucas critique).

---

# Recommended Next Steps

## For Engineering/Implementation
1. **Formalize Model**:
   - Specify functional forms for L(Y, r), I(.), S(.), and YFE(K, LS, A, uNatural).
   - Calibrate parameters using historical data (1970s oil shocks, Great Recession).
2. **Build Simulation Tool**:
   - Interactive IS-LM diagram allowing users to input shocks and see curve shifts.
   - Animate transitions from initial to new equilibrium.
   - Display time paths of Y, r, P, Emp.
3. **Quantify Shock Mappings**:
   - Develop empirical relationships: oil price change → ΔA, supply chain disruption index → ΔA.
   - Estimate price adjustment speed (LM shift dynamics).
4. **Extend to Open Economy**:
   - Integrate with Topics 9-11 (exchange rates, open economy macro).
   - Model supply chain disruptions as international trade shocks.

## For Analysis/Validation
5. **Empirical Testing**:
   - Validate model predictions against 1970s oil shock data (GDP↓, P↑, r↑).
   - Test 2022 supply chain shock: did inflation rise? Did Fed rate hikes reduce Y?
6. **Policy Scenario Analysis**:
   - Simulate fiscal expansion after supply shock → quantify additional inflation.
   - Compare "do nothing" vs. "tighten policy" vs. "fix supply chain" scenarios.
7. **Component Decomposition**:
   - Use BEA data to decompose GDP changes into C, I, G, NX during supply shocks.
   - Identify which components drive recession (as shown in spider graphs).

## For Pedagogy/Communication
8. **Develop Case Studies**:
   - 1973 oil shock, 1979 oil shock, 2022 supply chain disruption.
   - Include data, policy responses, outcomes.
9. **Create Decision Support Tool**:
   - For policymakers: input shock type → recommended policy response.
   - Highlight limitations (e.g., "monetary policy cannot restore Y after supply shock").
10. **Clarify Ambiguities**:
    - Define SG, specify L(.) functional form, document price adjustment mechanism.
    - Add quantitative examples (e.g., "10% oil price increase → 0.5% decline in A").

## For Risk Mitigation
11. **Sensitivity Analysis**:
    - Test model robustness to parameter uncertainty (elasticities, adjustment speeds).
12. **Multi-Shock Scenarios**:
    - Model simultaneous supply and demand shocks (e.g., 2022: supply chains + fiscal

### 08_demand_kd.pdf

# Executive Summary

This document covers **demand-driven recessions** and Keynesian macroeconomic theory, contrasting them with supply-driven recessions. Key points include:

- **Demand shocks** (shifts in IS or LM curves) cause recessions characterized by falling GDP, prices, and interest rates, but GDP can recover naturally or via policy intervention.
- **Supply shocks** (shifts in FE curve) cause GDP decline with rising prices and interest rates; no policy can restore original GDP without reversing the shock.
- **Keynesian insight**: Price and wage stickiness can prolong recessions, creating a rationale for fiscal and monetary intervention.
- **Policy tools**: Expansionary fiscal policy (increase G, decrease taxes) and monetary policy (increase money supply) can restore demand and GDP.
- **Complications**: Ricardian equivalence may reduce fiscal policy effectiveness; liquidity traps (zero lower bound on interest rates) render monetary policy ineffective, requiring fiscal intervention.
- **COVID-era case study**: $1.9 trillion fiscal stimulus in 2021 added demand "oomph" but contributed to inflation, as policymakers underestimated inflationary impact based on prior recession experiences.

---

# Purpose and Scope

## Purpose
- Explain the mechanics and policy responses to **demand-driven recessions** using the IS-LM framework.
- Contrast demand shocks with supply shocks in terms of causes, symptoms, and appropriate interventions.
- Introduce Keynesian economics, focusing on price/wage stickiness and the role of government stabilization policy.

## Scope
- **In scope**:
  - Causes of demand shocks (pessimism, wealth decline, tight fiscal/monetary policy)
  - IS-LM model dynamics during demand shocks
  - Fiscal and monetary policy responses
  - Ricardian equivalence and liquidity traps as complicating factors
  - Empirical evidence on price stickiness and fiscal multipliers
  - Application to Great Recession and COVID-19 recession
- **Out of scope**:
  - Detailed supply shock analysis (covered in prior topic)
  - Open economy considerations (covered in later topics)
  - Long-run growth models

---

# Key Concepts and Definitions

## Recession Types
- **Supply shock recession**: Caused by decline in full-employment output (FE curve shifts left); characterized by falling GDP, rising prices (P) and interest rates (r), falling investment (I), saving (S), consumption (C). GDP does not recover until shock reverses.
- **Demand shock recession**: Caused by decline in demand for goods/services (IS or LM curve shifts left); characterized by falling GDP, prices, and interest rates. GDP can recover naturally or via policy.

## Demand Shock Causes
- **IS curve shifts** (real shocks):
  - Pessimism about future productivity (AF↓ → I↓)
  - Pessimism about future income (YF↓ → S↑)
  - Wealth decline (W↓ → S↑)
  - Tight fiscal policy (SG↑ → S↑)
- **LM curve shifts** (nominal shocks):
  - Expectation of lower inflation (πe↓ → MD↑)
  - Tight monetary policy (MS↓)

## Keynesian Economics
- **Core insight**: Prices and wages are "sticky" (slow to adjust downward), prolonging recessions.
- **Implication**: Economy can remain below full employment (FE) for extended periods ("slack"), justifying government intervention.

## Key Terms
- **Slack**: Economy operating below potential (Y < YFE); creates downward pressure on prices.
- **Ricardian equivalence**: Theory that government spending increases are offset by private saving increases (anticipating future taxes), reducing fiscal policy effectiveness.
- **Liquidity trap**: Situation where interest rates are at or near zero, rendering monetary policy ineffective.
- **Fiscal multiplier**: Change in GDP resulting from a $1 change in government spending (G).
- **Menu costs**: Costs of changing prices (e.g., reprinting menus), contributing to price stickiness.
- **Efficiency wages**: Wages set above market-clearing level to boost productivity and reduce shirking.

---

# Inputs, Outputs, and Data Dependencies

## Model Inputs
- **Exogenous shocks**:
  - Expected future productivity (AF)
  - Expected future income (YF)
  - Wealth (W)
  - Government spending (G) and taxes (T)
  - Money supply (MS)
  - Expected inflation (πe)
- **Structural parameters**:
  - Price level (P)
  - Full-employment output (YFE)
  - Labor demand (L)

## Model Outputs
- **Equilibrium values**:
  - Output (Y)
  - Interest rate (r)
  - Price level (P)
  - Employment
  - Investment (I), Saving (S), Consumption (C)
- **Policy recommendations**:
  - Magnitude and timing of fiscal/monetary interventions

## Data Dependencies
- **Empirical evidence required**:
  - Price stickiness by sector (e.g., Bils and Klenow 2005 data)
  - Fiscal multiplier estimates (e.g., highway spending shocks, military spending during Great Depression)
  - Inflation expectations
  - Labor market slack indicators (unemployment, underemployment)

---

# Process / Model Logic

## Demand Shock Mechanism (e.g., Wealth Decline)

### Step 1: Initial Shock
- Wealth declines (W↓)
- Consumers increase saving (S) to smooth consumption
- Saving exceeds investment (S > I)
- Interest rate must fall to equilibrate goods market
- **IS curve shifts left** (IS0 → IS1)

### Step 2: Short-Run Disequilibrium ("Red Dot")
- Economy moves from (Y0, r0) to (Y1, r1)
- Output falls below full employment (Y1 < YFE)
- **Slack emerges**: Economy underperforms potential
- Downward pressure on prices (P)

### Step 3: Price Adjustment
- Price level falls (P0 → P1)
- Real money supply increases (MS/P ↑)
- Excess real money supply → interest rate falls further
- **LM curve shifts right** (LM0 → LM1)

### Step 4: Return to Equilibrium ("Blue Dot")
- Economy moves from (Y1, r1) to (Y0, r2)
- Output returns to full employment (Y0 = YFE)
- Interest rate lower than initial (r2 < r0)
- **General equilibrium restored**

### Timing Issue (Keynesian Concern)
- **If prices are sticky**, transition from Step 2 to Step 4 is slow
- Economy remains in recession (at "red dot") for extended period
- Empirical evidence: Great Recession recovery took ~4 years (2011-2015)

---

## Policy Intervention Logic

### Fiscal Policy Response
- **Action**: Increase government spending (G↑) or cut taxes (T↓)
- **Mechanism**:
  - Government dissaving (SG↓) shifts IS curve right
  - Restores output to YFE without waiting for price adjustment
- **Timing**: Must be implemented before natural recovery to avoid overshooting (inflation)

### Monetary Policy Response
- **Action**: Increase money supply (MS↑)
- **Mechanism**:
  - Real money supply increases (MS/P ↑)
  - LM curve shifts right
  - Interest rate falls, stimulating investment
  - Output returns to YFE
- **Timing**: Same constraint as fiscal policy

### Liquidity Trap Scenario
- **Condition**: Severe demand shock pushes equilibrium interest rate below zero (r* < 0)
- **Problem**: Nominal interest rates cannot go below zero (r ≥ 0)
- **Implication**: Monetary policy ineffective (LM curve cannot shift enough)
- **Solution**: Fiscal policy required; no crowding out occurs because r remains at zero

---

# Equations, Variables, and Parameters

## Core IS-LM Relationships

### IS Curve (Goods Market Equilibrium)
- **Condition**: S = I
- **Components**:
  - S = Sp + SG (private saving + government saving)
  - Sp = f(Y, YF, W, r) — increases with Y, decreases with YF and W, increases with r
  - SG = T - G — government saving
  - I = f(r, AF) — decreases with r, increases with AF
- **Shifts**:
  - Right: AF↑, YF↑, W↑, G↑, T↓
  - Left: AF↓, YF↓, W↓, G↓, T↑

### LM Curve (Money Market Equilibrium)
- **Condition**: MS/P = MD
- **Components**:
  - MS = nominal money supply (set by central bank)
  - P = price level
  - MD = f(Y, r, πe) — increases with Y and πe, decreases with r
- **Shifts**:
  - Right: MS↑, P↓, πe↓
  - Left: MS↓, P↑, πe↑

### FE Curve (Full Employment)
- **Condition**: Y = YFE = f(A, K, L)
- **Vertical line** at full-employment output
- **Shifts**:
  - Right: A↑ (productivity increase)
  - Left: A↓ (productivity decrease, e.g., oil shock)

## Price Adjustment Dynamics
- **If Y < YFE**: Slack → P falls → MS/P rises → LM shifts right
- **If Y > YFE**: Excess demand → P rises → MS/P falls → LM shifts left

## Fiscal Multiplier
- **Definition**: ΔY / ΔG (holding T constant)
- **Theoretical range**:
  - Multiplier = 0: Full Ricardian equivalence (ΔG = -ΔSp)
  - Multiplier < 1: Partial crowding out or implementation lags
  - Multiplier > 1: Incomplete private sector offset
- **Empirical estimates**:
  - Highway spending shocks: Significant short-term effect (1-2 years), long-term effect (6-8 years) via productivity
  - Great Depression military spending: Multiplier ≈ 2

---

# Rules, Constraints, and Assumptions

## Key Assumptions

### Price and Wage Stickiness
- **Assumption**: Prices and wages adjust slowly, especially downward
- **Evidence**:
  - Median months between price changes varies by sector (0.6 months for gasoline, 79.9 months for laundry services)
  - Wage stickiness increasing due to preference for one-time bonuses over permanent raises
- **Mechanisms**:
  - Menu costs (cost of changing prices)
  - Long-term contracts
  - Imperfect information/search costs
  - Market structure (imperfect competition allows price stickiness)

### Ricardian Equivalence
- **Assumption**: Consumers are forward-looking and rational
- **Implication**: ΔG → ΔT (expected future) → ΔSp (offsetting) → No net demand effect
- **Counterarguments**:
  - Little evidence households behave this way in general
  - May apply when government debt is very high
  - Liquidity constraints prevent full offset

### Zero Lower Bound (ZLB)
- **Constraint**: Nominal interest rates cannot fall below zero (r ≥ 0)
- **Implication**: Monetary policy loses effectiveness in severe recessions
- **Workarounds**:
  - Forward guidance (commit to keeping rates low)
  - Quantitative easing (buy long-term assets)
  - Negative interest rates (limited feasibility)

## Policy Rules and Constraints

### Timing Constraint
- **Rule**: Fiscal/monetary stimulus must be calibrated to shock severity and timed to avoid:
  - **Too early/large**: Inflation (economy overshoots YFE)
  - **Too late/small**: Prolonged recession
- **Challenge**: Difficulty forecasting shock magnitude and recovery speed (especially during unprecedented events like COVID-19)

### Debt Sustainability
- **Constraint**: Temporary deficits acceptable during demand recessions, but long-term debt must stabilize
- **Example**: Geithner (2013) estimated 0.75% of GDP in spending cuts/tax increases needed to stabilize debt over decade

### "Fighting the Last War" Bias
- **Observation**: Policymakers tend to apply lessons from previous recessions
- **Example**: Post-2008 recovery was slow with subdued inflation → Fed underestimated inflation risk from COVID-era stimulus

---

# UI/UX and Interaction Requirements (if any)

**Not applicable** — this is a theoretical macroeconomic model, not a software system. However, if building a simulation or teaching tool:

## Potential Interactive Features
- **IS-LM curve visualizer**:
  - Allow users to adjust parameters (G, MS, AF, W, etc.)
  - Animate curve shifts and equilibrium transitions
  - Highlight "red dot" (short-run disequilibrium) vs. "blue dot" (long-run equilibrium)
- **Scenario simulator**:
  - Compare supply shock vs. demand shock dynamics
  - Test policy interventions (fiscal vs. monetary)
  - Show liquidity trap scenario
- **Historical case studies**:
  - Great Depression
  - Great Recession (2008-2015)
  - COVID-19 recession (2020-2022)

---

# Technical Requirements and Integration Notes

## Model Implementation Requirements

### Core Calculation Engine
- **IS-LM solver**:
  - Solve simultaneous equations for (Y, r) given exogenous parameters
  - Handle corner cases (liquidity trap: r = 0)
- **Dynamic adjustment**:
  - Model price adjustment over time (P → P1 → P2...)
  - Track transition from short-run to long-run equilibrium

### Data Integration
- **Real-time inputs**:
  - Inflation expectations (πe)
  - Government spending (G) and tax revenue (T)
  - Money supply (MS)
  - GDP (Y), unemployment, capacity utilization (proxies for slack)
- **Historical data**:
  - Price stickiness by sector
  - Fiscal multiplier estimates
  - Past recession dynamics

### Policy Simulation
- **Scenario analysis**:
  - Compare "do nothing" vs. fiscal intervention vs. monetary intervention
  - Estimate optimal policy size and timing
- **Sensitivity analysis**:
  - Test robustness to Ricardian equivalence assumption
  - Vary price stickiness parameter

## Integration with Broader Macro Framework
- **Link to supply-side models** (Topic 7):
  - Distinguish FE curve shifts (supply) from IS/LM shifts (demand)
- **Link to open economy models** (Topics 9-11):
  - Incorporate exchange rate effects
  - Account for capital flows
- **Link to inflation models** (Topic 4):
  - Integrate money supply and inflation expectations

---

# Risks, Ambiguities, and Missing Information

## Ambiguities and Open Questions

### Fiscal Multiplier Magnitude
- **Question**: What is the "true" multiplier in different contexts?
- **Ambiguity**: Estimates range from 0 (full Ricardian equivalence) to >2 (Great Depression)
- **Missing**: Context-specific factors (debt level, interest rate environment, consumer confidence)

### Price Stickiness Duration
- **Question**: How long do prices remain sticky in a given recession?
- **Ambiguity**: Varies by sector (0.6 to 79.9 months between changes)
- **Missing**: Real-time indicators of when stickiness is "loosening"

### Liquidity Trap Threshold
- **Question**: At what point does monetary policy become ineffective?
- **Ambiguity**: Not just r = 0; effectiveness may decline as r approaches zero
- **Missing**: Quantitative threshold for switching to fiscal policy

### Ricardian Equivalence Applicability
- **Question**: When does Ricardian equivalence hold in practice?
- **Ambiguity**: "Little evidence in general" but "may apply when debt is high"
- **Missing**: Precise debt/GDP threshold or other conditions

### Optimal Policy Timing
- **Question**: How to time fiscal/monetary interventions to avoid inflation?

### 09_fx_kd.pdf

# Executive Summary

This document is a lecture on foreign exchange rates from a macroeconomic analysis course. It covers nominal and real exchange rates (RER), exchange rate regimes (fixed vs. floating), the relationship between exchange rates and goods prices, and the connection between exchange rates and asset returns (uncovered interest parity). The motivating case study examines Japanese yen carry trades and their sensitivity to central bank policy changes. Key takeaways include: RER adjusts nominal rates by purchasing power; fixed exchange rate regimes constrain monetary policy; and interest rate differentials drive currency appreciation/depreciation under uncovered interest parity.

---

# Purpose and Scope

## Purpose
- Explain nominal and real foreign exchange rates
- Analyze exchange rate regimes and their implications for monetary policy
- Introduce benchmarks for assessing whether currencies are "correctly" valued
- Demonstrate how central bank policy affects currency values and investment strategies (e.g., carry trades)

## Scope
- **In Scope:**
  - Nominal exchange rate definitions and conventions
  - Real exchange rate (RER) calculation and interpretation
  - Fixed vs. floating exchange rate regimes
  - Relationship between RER and trade flows
  - Uncovered interest parity (UIP) and asset returns
  - Case studies: Japan yen carry trade, China-US RER, Argentina currency peg
- **Out of Scope:**
  - Detailed trade modeling in ISLM (covered in next class)
  - Currency crisis mechanisms
  - Black market exchange rate dynamics

---

# Key Concepts and Definitions

## Nominal Exchange Rate
- **Definition:** The price of one currency in terms of another
- **Formula:** `e = Foreign Currency / Home Currency`
- **Convention:** An increase in `e` represents appreciation of the home (denominator) currency
- **Financial press convention:** Denominator country stated second (e.g., "dollar-euro" = dollars/euro)

## Real Exchange Rate (RER)
- **Definition:** An index comparing nominal exchange rate to purchasing power at home and abroad
- **Formula:** `RER_HOME = (Foreign Currency / Home Currency) × (Home CPI / Foreign CPI)`
- **Interpretation:**
  - RER = 1: Currency appropriately valued relative to goods prices
  - RER > 1: Home currency "over-valued" → incentive to import
  - RER < 1: Home currency "under-valued" → incentive to export

## Exchange Rate Regimes
- **Free-floating:** Determined by market forces
- **Fixed:** Price set by national government; susceptible to currency crises and black markets
- **Variants:** Currency boards, crawling bands, dollarization

## Uncovered Interest Parity (UIP)
- **Definition:** No-arbitrage condition stating that expected returns on assets denominated in different currencies should equalize when expressed in the same currency
- **Formula:** `(1 + r_US) = (e0 / e1) × (1 + r_EU)`
- **Implication:** Countries with higher interest rates should experience currency depreciation over time

---

# Inputs, Outputs, and Data Dependencies

## Inputs
- **Nominal exchange rate** (e.g., Yuan/USD, Pesos/USD)
- **Consumer Price Index (CPI)** for home and foreign countries
- **Goods prices** in local currencies (e.g., Big Mac prices, cigar prices)
- **Interest rates** (r) for home and foreign countries
- **Exchange rate regime type** (fixed, floating, etc.)

## Outputs
- **Real Exchange Rate (RER)** value
- **Assessment of currency valuation** (over-valued, under-valued, appropriately valued)
- **Trade flow predictions** (import vs. export incentives)
- **Expected currency appreciation/depreciation** based on interest rate differentials

## Data Dependencies
- Accurate and timely CPI data (note: Argentina case highlights risk of manipulated official inflation statistics)
- Current and expected future nominal exchange rates
- Central bank policy rates (e.g., Federal Reserve, Bank of Japan)
- Market prices for identical or comparable goods across countries

---

# Process / Model Logic

## RER Calculation and Interpretation Process
1. Obtain nominal exchange rate (Foreign Currency / Home Currency)
2. Obtain CPI for home and foreign countries
3. Calculate RER = e × (Home CPI / Foreign CPI)
4. Compare RER to 1:
   - If RER > 1: Home currency over-valued → expect imports to rise
   - If RER < 1: Home currency under-valued → expect exports to rise
5. Predict adjustment mechanism:
   - **Floating regime:** Nominal exchange rate adjusts
   - **Fixed regime:** Domestic and/or foreign price levels adjust

## Fixed Exchange Rate Adjustment Logic
- If nominal rate is fixed, RER adjustment to 1 occurs only through price movements
- Example: China-US case
  - RER_US > 1 (USD over-valued)
  - With fixed nominal rate, adjustment requires:
    - Prices rise faster in China than in US
    - This reduces RER_US toward 1
- Mechanism: Trade surplus → foreign currency inflows → domestic money supply expansion → inflation

## Uncovered Interest Parity (UIP) Logic
1. Start with 1 unit of home currency at time 0
2. Convert to foreign currency at rate e0
3. Invest foreign currency at foreign interest rate r_foreign for one period
4. Convert back to home currency at rate e1
5. No-arbitrage condition: `(1 + r_home) = (e0 / e1) × (1 + r_foreign)`
6. Rearranged: `e1 / e0 = (1 + r_foreign) / (1 + r_home)`
7. **Implication:** Higher foreign interest rate → foreign currency depreciates (e1 increases)

## Carry Trade Logic (Japan Example)
1. Borrow in low-interest-rate currency (Yen at ~0%)
2. Convert to high-interest-rate currency (USD)
3. Invest in high-return assets (US Treasuries at 5%, US stocks)
4. Profit = interest differential minus currency movement
5. **Risk factors:**
   - Home currency appreciation (Yen strengthens) → more expensive to repay loan
   - Foreign currency depreciation (USD weakens) → lower value when converting back
   - Central bank policy changes (BoJ rate hikes, Fed rate cuts) → alter interest differentials and currency values

---

# Equations, Variables, and Parameters

## Core Equations

### Real Exchange Rate
```
RER_HOME = e × (P_HOME / P_FOREIGN)
```
Where:
- `e` = nominal exchange rate (Foreign Currency / Home Currency)
- `P_HOME` = home country CPI
- `P_FOREIGN` = foreign country CPI

### Uncovered Interest Parity
```
(1 + r_HOME) = (e0 / e1) × (1 + r_FOREIGN)
```
Rearranged:
```
e1 / e0 = (1 + r_FOREIGN) / (1 + r_HOME)
```
Where:
- `r_HOME` = home country interest rate
- `r_FOREIGN` = foreign country interest rate
- `e0` = nominal exchange rate at time 0
- `e1` = nominal exchange rate at time 1

## Variables and Parameters

| Variable | Definition | Example Values |
|----------|------------|----------------|
| e | Nominal exchange rate (Foreign/Home) | 6.78 Yuan/USD, 1 Peso/USD |
| RER | Real exchange rate | 1.91 (China-US, 2010) |
| P_HOME | Home country price level (CPI) | $3.73 (Big Mac, US) |
| P_FOREIGN | Foreign country price level (CPI) | 13.2 RMB (Big Mac, China) |
| r_HOME | Home country interest rate | ~5% (US Treasury, 2024) |
| r_FOREIGN | Foreign country interest rate | ~0% (Japan, pre-2024) |

## Worked Example: China-US RER (2010)
```
RER_US = e × (P_US / P_CHINA)
RER_US = (6.78 Yuan/USD) × ($3.73 / 13.2 RMB)
RER_US = 1.91
```
**Interpretation:** USD is over-valued; buys more Big Macs in China than in US; incentive to import from China

**Implied "correct" nominal rate:**
```
If RER = 1, then e = P_CHINA / P_US = 13.2 / 3.73 = 3.54 Yuan/USD
```
**Prediction:** USD should depreciate (fall) against Yuan

---

# Rules, Constraints, and Assumptions

## Rules

### RER Interpretation Rules
- **RER > 1:** Home currency over-valued → imports increase
- **RER < 1:** Home currency under-valued → exports increase
- **RER = 1:** Currency appropriately valued relative to goods prices

### UIP Implications
- Higher interest rate country → currency depreciates over time
- Equal expected returns when expressed in same currency (no-arbitrage)

## Constraints

### Fixed Exchange Rate Regimes
- **Constraint:** Nominal exchange rate cannot adjust to market forces
- **Implication:** RER adjustment must occur through domestic price changes
- **Policy constraint:** Monetary policy loses independence
  - Cannot pursue independent inflation targets
  - Money supply changes driven by balance of payments
- **Vulnerability:** Susceptible to currency crises if market believes peg is unsustainable

### Floating Exchange Rate Regimes
- **Flexibility:** Nominal rate adjusts to market conditions
- **Implication:** RER can adjust through both nominal rate and price changes
- **Policy independence:** Greater monetary policy autonomy

## Assumptions

### Purchasing Power Parity (PPP) Assumption
- Implicit assumption: Identical goods should have same price across countries when expressed in common currency
- **Reality:** Transportation costs, tariffs, non-tradable components, and market segmentation create deviations

### UIP Assumptions
- No capital controls
- Perfect capital mobility
- Risk-neutral investors
- No transaction costs
- Rational expectations about future exchange rates

### Big Mac Index Assumptions
- Big Macs are sufficiently standardized across countries
- Represents broader price level (may not hold due to local input costs, wages, rent)

## Known Violations and Limitations
- **Argentina inflation data:** Official CPI significantly understated true inflation (per Billion Prices Project)
- **Carry trade risks:** UIP often violated in short run; currencies of high-interest-rate countries often appreciate (carry trade profits persist)

---

# UI/UX and Interaction Requirements (if any)

**Not applicable** — this is a lecture document with no software interface requirements.

---

# Technical Requirements and Integration Notes

## Data Requirements
- **Real-time or frequent updates:**
  - Nominal exchange rates (daily or intraday for trading applications)
  - Central bank policy rates
- **Periodic updates:**
  - CPI data (monthly)
  - Goods prices for PPP comparisons
- **Data quality concerns:**
  - Official inflation statistics may be manipulated (Argentina case)
  - Alternative data sources (e.g., Billion Prices Project, web scraping) may be needed

## Integration with Macroeconomic Models
- **ISLM framework:** Exchange rates affect net exports (NX), which shifts IS curve
- **Money supply (LM curve):** In fixed exchange rate regimes, foreign exchange interventions affect domestic money supply
  - Example: China trade surplus → USD inflows → conversion to RMB → LM curve shifts right → inflation
- **Monetary policy transmission:** Central bank rate changes affect exchange rates via UIP

## Calculation and Monitoring Systems
- **RER monitoring:** Requires integration of:
  - Exchange rate feeds
  - CPI databases for multiple countries
  - Historical data for trend analysis
- **Carry trade profitability:** Requires:
  - Interest rate differentials
  - Exchange rate forecasts
  - Risk metrics (volatility, correlation)

---

# Risks, Ambiguities, and Missing Information

## Risks

### Policy Risks
- **Fixed exchange rate regimes:**
  - Currency crisis risk if market loses confidence in peg
  - Loss of monetary policy independence
  - Potential for black market exchange rates
- **Carry trades:**
  - Sudden central bank policy shifts (e.g., BoJ rate hikes)
  - Coordinated unwinding can cause market disruptions
  - Leverage amplifies losses

### Data Risks
- **Manipulated statistics:** Official inflation data may be unreliable (Argentina example)
- **Measurement issues:** CPI may not reflect true cost of living or may differ in composition across countries

## Ambiguities

### Questions Requiring Clarification
1. **What is the appropriate time horizon for RER adjustment?**
   - Document shows China-US example over 3-5 years, but no general guidance provided
2. **How should RER be calculated for baskets of currencies (trade-weighted)?**
   - Only bilateral examples provided
3. **What constitutes "identical" goods for PPP comparisons?**
   - Big Mac example is illustrative but may not generalize
4. **How do capital controls affect UIP?**
   - Mentioned as potential issue but not analyzed
5. **What triggers currency crises in fixed regimes?**
   - Mentioned as risk but mechanism not detailed
6. **Why do carry trades persist if UIP should hold?**
   - Empirical violation noted but not explained (risk premium? Irrational expectations?)

### Incomplete Specifications
- **Exchange rate regime choice criteria:** Document asks "Why choose fixed over floating?" but doesn't provide answer
- **Optimal intervention strategies:** How should central banks manage fixed pegs?
- **Crisis thresholds:** At what RER deviation does a fixed peg become unsustainable?

## Missing Information

### Empirical Evidence
- **Frequency and magnitude of RER deviations:** How common is RER ≠ 1?
- **Speed of adjustment:** How quickly do RER deviations correct?
- **UIP violations:** Quantitative evidence on carry trade returns and risk

### Policy Frameworks
- **Central bank intervention mechanics:** How do central banks maintain fixed pegs? (foreign exchange reserves, capital controls, etc.)
- **Optimal exchange rate regime selection:** Decision framework for countries choosing regime type

### Extensions
- **Multiple country analysis:** How to handle RER with more than two countries?
- **Trade-weighted exchange rates:** Construction and interpretation
- **Forward exchange rates:** Relationship to UIP and covered interest parity

---

# Recommended Next Steps

## For Course/Learning Context
1. **Review next lecture materials** on trade in ISLM framework to understand how exchange rates affect aggregate demand
2. **Study historical currency crises** (e.g., Argentina 2001, Asian Financial Crisis 1997) to understand fixed regime vulnerabilities
3. **Analyze current carry trade opportunities** using real-time data on interest rate differentials and exchange rate trends
4. **Examine trade-weighted exchange rate indices** (e.g., US Dollar Index) for multi-country analysis

## For Implementation/Engineering Planning
1. **Define data pipeline requirements:**
   - Identify authoritative sources for exchange rates, interest rates, and CPI
   - Establish update frequencies and latency requirements
   - Implement data quality checks (detect anomalies like Argentina inflation manipulation)
2. **Build RER calculation engine:**
   - Implement formula: `RER = e × (P_HOME / P_FOREIGN)`
   - Support bilateral and trade-weighted calculations
   - Create alerting for RER deviations from 1 (thresholds TBD)
3. **Develop UIP monitoring system:**
   - Calculate implied future exchange rates from interest rate differentials
   - Compare to forward rates and market expectations
   - Track carry trade profitability metrics
4. **Create visualization dashboards:**
   - Time series of nominal and real exchange rates
   - RER deviation from parity
   - Interest rate differentials and implied currency movements
5. **Integrate with macroeconomic models:**
   - Link exchange rates to ISLM framework (NX component)
   - Model monetary policy constraints under fixed regimes
   - Simulate policy scenarios (e.g., central bank rate changes)

## Gap Analysis Priorities
1. **Clarify exchange rate regime choice criteria** — research literature or consult policy experts
2. **Obtain empirical data on RER adjustment speeds** — needed for forecasting and risk management
3. **Investigate UIP violations and carry trade persistence** — understand risk premia and behavioral factors
4. **Document currency crisis triggers and early warning indicators** — critical for fixed regime risk assessment
5. **Validate PPP assumptions for specific goods/sectors** — determine when Big Mac Index-style analysis

### 10_open_kd.pdf

# Executive Summary

This document is a lecture presentation on **Open Economy Macroeconomics** from MGT 425 (Macroeconomic Analysis) at Yale School of Management. It extends closed-economy macroeconomic models (IS-LM framework) to incorporate international trade flows and capital flows. The core insight is that in an open economy, **domestic investment equals domestic saving minus net exports** (I = S - NX), or equivalently, domestic investment plus foreign saving. Trade deficits are not inherently harmful; they reflect capital inflows that finance domestic investment. The document uses real-world examples (U.S.-China trade, Finland's depression, Plaza Accord, George Soros vs. Bank of England) to illustrate how exchange rates, trade flows, and monetary policy interact across borders.

---

# Purpose and Scope

## Purpose
- Teach students how to analyze macroeconomic dynamics in economies open to international trade and capital flows
- Correct common misconceptions about trade deficits (e.g., that they represent "losses")
- Demonstrate how domestic monetary and fiscal policy affects foreign economies and vice versa

## Scope
- Extension of IS-LM model to open economies
- Relationship between current account (trade flows) and financial account (capital flows)
- Impact of exchange rate movements on net exports and IS curve
- Case studies: U.S.-Canada/China trade, Finland's Great Depression, Plaza Accord, ERM crisis, China's RMB policy

## Out of Scope
- Detailed exchange rate determination models (covered in prior lecture)
- Microeconomic foundations of trade
- Long-run growth implications

---

# Key Concepts and Definitions

## Core Identity (Open Economy)
- **Y = C + I + G + (X - M)** where:
  - Y = GDP
  - C = Consumption
  - I = Investment
  - G = Government spending
  - X = Exports
  - M = Imports
  - (X - M) = Net Exports (NX)

## Trade Balance Definitions
- **Trade Surplus**: NX > 0 (exports exceed imports)
- **Trade Deficit**: NX < 0 (imports exceed exports)
- **Balanced Trade**: NX = 0

## Saving-Investment Identity (Open Economy)
- **I = S - NX** (equivalently: **I = S + S_foreign**)
  - S = Domestic saving (private + government)
  - S_foreign = Foreign saving invested domestically
  - When NX < 0 (trade deficit), foreign saving flows in to finance domestic investment

## Current vs. Financial Account
- **Current Account (CA)**: Net exports of goods/services; CA = S - I
- **Financial Account (FA)**: Net capital inflows; FA = -CA
- Global sum of current accounts = 0 (one country's deficit is another's surplus)

## Real Exchange Rate (RER)
- **RER_US = (Foreign Currency / US Currency) × (US CPI / Foreign CPI)**
- Decline in RER_home → home goods cheaper → boosts exports

---

# Inputs, Outputs, and Data Dependencies

## Inputs
- **Domestic variables**: Y, C, I, G, S_private, S_government, interest rate (r)
- **Trade variables**: X, M, NX
- **Exchange rates**: Nominal exchange rate (e), price levels (CPI_home, CPI_foreign), RER
- **Foreign variables**: Y_partner, A_partner (productivity in trading partner), r_foreign
- **Policy variables**: Tariffs, monetary policy (Fed rate changes), fiscal policy (G, T)

## Outputs
- Equilibrium GDP (Y*), interest rate (r*), investment (I*), net exports (NX*)
- Trade balance position (surplus/deficit)
- Capital flow direction (inflows/outflows)

## Data Dependencies
- Real-time exchange rate data
- Trading partner GDP and policy changes
- Domestic and foreign inflation rates (CPI)
- Central bank policy rates (Fed funds rate, etc.)

---

# Process / Model Logic

## Closed Economy Baseline
1. Start with **Y = C + I + G**
2. Derive **I = Y - C - G**
3. Substitute **I = (Y - C - T) + (T - G) = S_private + S_government = S**
4. Result: **I = S** (investment equals domestic saving)

## Open Economy Extension
1. Start with **Y = C + I + G + (X - M)**
2. Rearrange: **I = Y - C - G - (X - M)**
3. Substitute: **I = (Y - C - T) + (T - G) - (X - M)**
4. Result: **I = S - NX** or **I = S + S_foreign**

## Interpretation
- **Trade deficit (NX < 0)**: Foreign saving flows in → more resources for domestic investment
- **Trade surplus (NX > 0)**: Domestic saving flows out → fewer resources for domestic investment
- Example: U.S.-China trade deficit means China sends goods to U.S. and receives financial assets (loans, bonds, equities) in return

## IS-LM in Open Economy
- **IS curve**: Now represents **S - NX = I** (not just S = I)
- **Shocks to NX shift IS curve**:
  - NX ↑ (export boom) → IS shifts right (like investment boom)
  - NX ↓ (export crash) → IS shifts left (like investment crash)
- **LM curve**: Unchanged (money market equilibrium)

## Two-Country Model (U.S.-Japan Example)
1. World interest rate (r) equilibrates global saving and investment
2. U.S. productivity boom (A_F,US ↑) → I_US shifts right
3. Result: r ↑, NX_US ↓, NX_Japan ↑ (Japan sends more saving to U.S.)

---

# Equations, Variables, and Parameters

## Core Identities
| Equation | Description |
|----------|-------------|
| Y = C + I + G + (X - M) | GDP accounting identity (open economy) |
| I = S - NX | Investment-saving identity (open economy) |
| I = S + S_foreign | Equivalent form (foreign saving = -NX) |
| CA = S - I | Current account balance |
| FA = -CA | Financial account balance |

## Real Exchange Rate
| Equation | Description |
|----------|-------------|
| RER_home = (e) × (P_home / P_foreign) | Real exchange rate |
| e = Foreign Currency / Home Currency | Nominal exchange rate |

## Variables
- **Y**: GDP (output)
- **C**: Consumption
- **I**: Investment
- **G**: Government spending
- **X**: Exports
- **M**: Imports
- **NX**: Net exports (X - M)
- **S**: Domestic saving (S_private + S_government)
- **S_foreign**: Foreign saving invested domestically
- **r**: Interest rate (domestic or world)
- **e**: Nominal exchange rate
- **P**: Price level (CPI)
- **RER**: Real exchange rate

## Parameters
- **A**: Productivity (domestic or foreign)
- **T**: Taxes
- **Y_partner**: Trading partner GDP

---

# Rules, Constraints, and Assumptions

## Accounting Constraints
- **Global current accounts sum to zero**: One country's deficit = another's surplus
- **CA + FA = 0**: Current account and financial account must balance
- **I = S - NX** must hold in equilibrium

## Behavioral Assumptions
- **Investment (I)** is decreasing in interest rate (r)
- **Saving (S)** is increasing in interest rate (r)
- **Net exports (NX)** are:
  - Increasing in trading partner GDP (Y_partner)
  - Decreasing in home GDP (Y_home) [more imports]
  - Decreasing in real exchange rate (RER_home) [home goods more expensive]

## Policy Constraints
- **Fixed exchange rate regimes** (e.g., ERM, Argentina 1:1 peg) constrain monetary policy
  - To maintain fixed e, central bank must adjust money supply to offset price changes
  - Expansionary monetary policy → inflation → RER ↑ → undermines peg
- **Floating exchange rate regimes** allow independent monetary policy

## Equilibrium Conditions
- **Goods market**: Y = C + I + G + NX (IS curve)
- **Money market**: M/P = L(r, Y) (LM curve)
- **Full employment**: Y = Y_FE (long run)

---

# UI/UX and Interaction Requirements (if any)

**Not applicable** — this is a lecture presentation, not a software system.

---

# Technical Requirements and Integration Notes

## Model Implementation Requirements
- **IS-LM solver** must incorporate NX term in IS curve
- **Two-country models** require simultaneous solution of:
  - Home country IS-LM
  - Foreign country IS-LM
  - World interest rate equilibration (S_world = I_world)
- **Dynamic simulations** for case studies (Finland, Plaza Accord) require:
  - Time-series data on GDP, exchange rates, interest rates
  - Shock identification (e.g., USSR collapse, German reunification)

## Data Integration
- **Exchange rate feeds**: Real-time nominal and real exchange rates
- **Trade data**: Bilateral trade flows (X, M) by country
- **Capital flow data**: Financial account transactions
- **Macroeconomic indicators**: GDP, CPI, interest rates (domestic and foreign)

## Calibration Needs
- **Elasticities**: How responsive are NX to RER, Y_partner, Y_home?
- **Interest rate sensitivity**: Investment and saving functions
- **Speed of adjustment**: How quickly do exchange rates and trade flows respond to shocks?

---

# Risks, Ambiguities, and Missing Information

## Ambiguities in Document
1. **Quantitative relationships not specified**:
   - What is the elasticity of NX with respect to RER?
   - How much does a 1% change in Y_partner affect home exports?
   - What is the magnitude of IS curve shifts from NX shocks?

2. **Case study details incomplete**:
   - **Finland**: Exact magnitude of USSR trade collapse not quantified
   - **Plaza Accord**: Mechanism of coordinated intervention not fully explained
   - **Soros/ERM**: Specific trading strategies and volumes not detailed
   - **China RMB**: Timeline and policy response parameters missing

3. **Policy transmission channels underspecified**:
   - How exactly does Fed rate hike cause capital outflows from developing countries?
   - What is the threshold for "falling too far behind the Fed"?

4. **Argentina example incomplete**:
   - What specific monetary policy undermined the 1:1 peg?
   - What were the effects on trading partners?

## Missing Information (Questions to Resolve)
- **Q1**: What are the empirical values for trade elasticities (price, income)?
- **Q2**: How do we calibrate the two-country model for specific country pairs?
- **Q3**: What is the lag structure for NX response to RER changes?
- **Q4**: How do we model expectations in fixed vs. floating exchange rate regimes?
- **Q5**: What are the welfare implications of trade deficits vs. surpluses?
- **Q6**: How do tariffs and trade policy fit into the NX function?
- **Q7**: What is the role of reserve currency status (USD) in these dynamics?

## Risks
- **Model oversimplification**: Two-country models may miss multilateral trade dynamics
- **Linearization errors**: IS-LM assumes linear relationships; real-world may be nonlinear
- **Expectation effects**: Model does not explicitly incorporate forward-looking behavior
- **Financial crises**: Capital flow reversals (sudden stops) not modeled
- **Political economy**: Trade policy responses (tariffs, sanctions) treated as exogenous

---

# Recommended Next Steps

## For Engineering/Implementation
1. **Build open-economy IS-LM solver**:
   - Extend existing closed-economy model to include NX term
   - Implement two-country equilibrium solver
   - Add shock simulation capability (NX shocks, foreign r shocks)

2. **Develop data pipeline**:
   - Integrate exchange rate APIs (nominal and real)
   - Pull bilateral trade data (OECD, IMF, World Bank)
   - Automate CPI and interest rate feeds

3. **Calibrate model parameters**:
   - Estimate NX elasticities from historical data
   - Calibrate investment and saving functions
   - Validate against case studies (Finland, Plaza Accord)

## For Analysis/Research
4. **Quantify case studies**:
   - Finland: Estimate impact of USSR collapse on NX, Y, r
   - Plaza Accord: Measure effect of coordinated intervention on RER, NX
   - ERM crisis: Model Soros trade and Bank of England response
   - China: Analyze RMB undervaluation and U.S. trade deficit

5. **Extend model**:
   - Add tariff/trade policy variables to NX function
   - Incorporate expectations (forward-looking IS curve)
   - Model sudden stops and capital flow reversals
   - Add multiple countries (not just two-country)

## For Documentation/Communication
6. **Clarify misconceptions**:
   - Develop clear explainer: "Why trade deficits are not losses"
   - Document relationship between CA and FA with examples
   - Create visual aids for two-country model dynamics

7. **Gap analysis**:
   - Identify missing empirical parameters (see Q1-Q7 above)
   - Document assumptions and their validity
   - Flag areas where model predictions diverge from reality

## For Policy Application
8. **Scenario planning**:
   - Simulate Fed rate hike impact on emerging markets
   - Model tariff war scenarios (U.S.-China)
   - Analyze exchange rate peg sustainability (Argentina-style)

9. **Risk assessment**:
   - Identify countries vulnerable to capital flow reversals
   - Assess sustainability of large trade imbalances
   - Evaluate contagion risks from major economy shocks

---

## Summary of Key Takeaways for Implementation

| Concept | Implementation Requirement |
|---------|----------------------------|
| I = S - NX | Modify IS curve equation in solver |
| NX shocks shift IS | Add NX shock parameters to model |
| Two-country equilibrium | Solve simultaneous IS-LM for home and foreign |
| RER affects NX | Include RER elasticity in NX function |
| Fed policy affects foreign r | Model capital flow response to interest rate differentials |
| Fixed exchange rate constraints | Implement monetary policy rule to maintain e |

**Critical unknowns requiring resolution before full implementation**: Trade elasticities, lag structures, expectation formation, nonlinear dynamics, multi-country interactions.

### 11_trade_kd.pdf

# Executive Summary

This document is a teaching case study from MGT 425: Macroeconomic Analysis (Spring 2025) that simulates a role-playing exercise where students act as chief economist at SOM Capital hedge fund. The exercise requires analyzing macroeconomic shocks from U.S. tariff policies (implemented in early 2025) and forecasting economic impacts and central bank responses for the U.S., E.U., and China. The document presents real-world economic data, expert opinions, and requires students to apply IS-LM-FE macroeconomic framework to predict policy responses and economic outcomes.

**Key Context:**
- Timeline: April-May 2025 (hypothetical/teaching scenario)
- Primary shock: U.S. tariffs on China (145%), reciprocal tariffs on E.U., and tariffs on Canada/Mexico
- Secondary effects: Supply chain disruptions, consumer uncertainty, investment freezes, inflation pressures
- Central question: How will Fed, ECB, and Central Bank of China respond?

# Purpose and Scope

## Purpose
- Educational exercise to apply macroeconomic theory (IS-LM-FE model) to real-world policy scenarios
- Develop forecasting skills for economic conditions and central bank policy responses
- Analyze multi-region economic interdependencies during trade shocks

## Scope
**In Scope:**
- U.S. economic conditions and Federal Reserve policy outlook (rest of 2025)
- E.U. economic conditions and ECB policy outlook (rest of 2025)
- China economic conditions and Central Bank of China policy outlook (rest of 2025)
- Tariff impacts on supply chains, inflation, consumer behavior, and investment
- Fiscal and monetary policy response scenarios

**Out of Scope:**
- Detailed sector-specific analysis beyond examples provided (auto, housing, consumer goods)
- Long-term structural economic changes beyond 2025
- Geopolitical analysis beyond economic/trade policy
- Quantitative model implementation (exercise is conceptual/qualitative)

# Key Concepts and Definitions

## Economic Framework
- **IS-LM-FE Model**: Macroeconomic framework showing equilibrium between:
  - **IS Curve**: Investment-Savings equilibrium (goods market)
  - **LM Curve**: Liquidity preference-Money supply equilibrium (money market)
  - **FE Curve**: Full Employment output level
  - Variables: Interest rate (r), Output (Y)

## Key Economic Shocks Identified

### U.S. Shocks
- **Supply-side disruption**: "Covid-like interruptions" in supply chains (auto, housing sectors)
- **Demand-side shock**: Consumer "wait-and-see attitude" due to uncertainty
- **Investment freeze**: Businesses minimizing new investments due to "too chaotic" conditions
- **Inflation pressure**: Fed's preferred inflation gauge forecast at 4.4-4.6%

### E.U. Shocks
- **Export demand reduction**: U.S. tariffs reducing demand for European exports
- **Uncertainty effects**: Chilling investment and household spending
- **Potential positive shock**: Capital inflows from "stronger investor interest in euro-denominated assets"
- **Deflationary pressure**: Weaker growth, stronger euro, potential goods redirection from China

### China Shocks
- **Export collapse**: 145% U.S. tariffs on Chinese goods
- **Pre-existing weakness**: Property crisis, weak domestic consumption
- **Manufacturing slowdown**: "Sharpest monthly slowdown in more than a year" (April data)

## Policy Response Types
- **Monetary policy**: Interest rate adjustments by central banks
- **Fiscal policy**: Government spending/borrowing (e.g., Germany's €500B infrastructure fund)

# Inputs, Outputs, and Data Dependencies

## Inputs (Economic Data Points)

### U.S. Data
- Tariff implementation dates: March 4 (Canada/Mexico), April 2 (reciprocal tariffs)
- Inflation forecast: 4.4% (J.P. Morgan), 4.6% (UBS) for Fed's preferred gauge
- Stock market: Declining (mentioned as consumer concern)
- Next Fed meeting: May 6-7, 2025
- Market-implied rate cut probability (as of April 4): ~30% for May meeting

### E.U. Data
- Q1 2025 growth: "Faster pace" than previous period
- ECB rate cuts: 7 cuts in last 8 meetings (as of April 2025)
- Germany fiscal policy: €500B infrastructure fund authorized (implementation delayed to 2026)
- Euro/Dollar exchange rate: Strengthening euro (chart shows appreciation after April 2 tariffs)
- Next ECB meeting: June 4-5, 2025
- Import dependency: 21% of European imports from China

### China Data
- U.S. tariff rate on Chinese goods: 145%
- April manufacturing activity: Sharpest monthly slowdown in >1 year
- Pre-existing conditions: Property crisis, weak domestic consumption, export-dependent growth

## Outputs (Required Forecasts)

For each region (U.S., E.U., China):
1. **Curve movements**: Which IS/LM/FE curves shift and in what direction
2. **Fiscal response prediction**: Will government implement fiscal stimulus?
3. **Monetary response prediction**: Will central bank cut/raise/hold rates?
4. **Economic outcome**: Growth and inflation trajectory

## Data Dependencies
- **Cross-region dependencies**:
  - E.U. forecast depends on Fed decisions
  - E.U. forecast depends on China trade redirection (21% import share)
  - China forecast depends on U.S. tariff policy stability
- **Policy interdependencies**:
  - ECB policy freedom constrained by Fed actions (mentioned by Neil Dutta)
  - Fed policy constrained by inflation vs. growth trade-off

# Process / Model Logic

## IS-LM-FE Analysis Framework

### Step 1: Identify Shock Type and Direction
For each region, categorize shocks as:
- **IS curve shifters**: Changes in investment (I), government spending (G), exports (NX)
- **LM curve shifters**: Changes in money supply or money demand
- **FE curve shifters**: Changes in productive capacity or labor supply

### Step 2: Predict Curve Movements

**U.S. Expected Movements:**
- IS curve: LEFT (reduced investment due to uncertainty, reduced consumption due to wait-and-see behavior)
- Potential IS curve: RIGHT if fiscal response implemented (not indicated)
- LM curve: Potentially RIGHT if Fed cuts rates (debated)
- FE curve: Potentially LEFT if supply disruptions reduce productive capacity

**E.U. Expected Movements:**
- IS curve: LEFT (reduced exports to U.S., reduced investment/consumption from uncertainty)
- IS curve: Potentially RIGHT from fiscal stimulus (Germany's €500B, but delayed to 2026)
- IS curve: Potentially RIGHT from capital inflows (stronger euro demand)
- LM curve: RIGHT (ECB likely to continue rate cuts per expert consensus)
- FE curve: Minimal movement expected

**China Expected Movements:**
- IS curve: LEFT (export collapse, continued weak domestic demand)
- IS curve: Potentially RIGHT from fiscal stimulus (subsidies, pension benefits proposed)
- LM curve: Potentially RIGHT if monetary easing implemented
- FE curve: Minimal movement expected

### Step 3: Assess Policy Response Constraints

**Fed Constraints:**
- Inflation at 4.4-4.6% (above typical 2% target)
- Political pressure from President Trump to cut rates
- Powell's stated position: "wait and see" approach
- Dual mandate tension: Growth slowing but inflation elevated

**ECB Constraints:**
- Already implemented 7 rate cuts in 8 meetings
- Inflation cooling toward target
- "Freer to cut rates" than Fed (no domestic tariff-driven inflation)
- Consensus expectation: Further cuts likely

**Central Bank of China Constraints:**
- Structural issues (property crisis) limit monetary policy effectiveness
- Fiscal measures (subsidies, pensions) appear to be primary response tool

### Step 4: Synthesize Forecast
Combine curve movements with policy responses to predict:
- Output (Y) direction and magnitude
- Interest rate (r) direction
- Inflation trajectory
- Recession probability

## Competitor Economist Positions (Benchmarks)

### U.S. Forecasts
- **Michael Feroli (J.P. Morgan)**: Recession in H2 2025, Fed cuts restart in June, inflation to 4.4%
- **Jonathan Pingle (UBS)**: 1 percentage point of cuts in 2025, core inflation to 4.6%
- **Seth Carpenter (Morgan Stanley)**: Higher burden of proof for cuts due to inflation

### E.U. Forecasts
- **Franziska Palmas (Capital Economics)**: Growth to "slow sharply" in next 6 months
- **Neil Dutta (Renaissance Macro)**: ECB freer to cut rates, focus on cushioning growth hit
- **Valdis Dombrovskis (EU Commissioner)**: Potential for capital inflows to euro assets

### China Forecasts
- **Zichun Huang (Capital Economics)**: Economy "coming under pressure as external demand cools"

# Equations, Variables, and Parameters

## IS-LM-FE Model Components

### IS Curve (Goods Market Equilibrium)
**Conceptual form:** Y = C(Y - T) + I(r) + G + NX(ε, Y*, Y)

Where:
- Y = Output/GDP
- C = Consumption (function of disposable income Y - T)
- T = Taxes
- I = Investment (decreasing function of interest rate r)
- r = Real interest rate
- G = Government spending
- NX = Net exports (function of exchange rate ε, foreign income Y*, domestic income Y)

**Shock impacts on IS:**
- ↓I (investment freeze) → IS shifts LEFT
- ↓C (consumer wait-and-see) → IS shifts LEFT
- ↓NX (tariffs reduce exports) → IS shifts LEFT
- ↑G (fiscal stimulus) → IS shifts RIGHT

### LM Curve (Money Market Equilibrium)
**Conceptual form:** M/P = L(r, Y)

Where:
- M = Money supply
- P = Price level
- L = Money demand (decreasing in r, increasing in Y)

**Shock impacts on LM:**
- ↑M (monetary easing/rate cuts) → LM shifts RIGHT
- ↓M (monetary tightening) → LM shifts LEFT

### FE Curve (Full Employment Output)
**Conceptual form:** Y = F(K, L)

Where:
- K = Capital stock
- L = Labor supply
- F = Production function

**Shock impacts on FE:**
- Supply chain disruptions → Potential LEFT shift (reduced effective K)
- Structural changes minimal in short-run

## Key Parameters (Implicit)

### U.S.
- Current inflation: 4.4-4.6% (vs. ~2% target)
- Market-implied May rate cut probability: ~30%
- Tariff rates: Not specified for reciprocal tariffs (China at 145%)

### E.U.
- Recent ECB rate cuts: 7 in last 8 meetings (magnitude not specified)
- Germany fiscal package: €500B
- Import share from China: 21%
- Euro appreciation: Visible in chart (magnitude not quantified)

### China
- U.S. tariff on Chinese goods: 145%
- Export dependency: High (qualitative, not quantified)
- Domestic consumption: "Stubbornly weak"

# Rules, Constraints, and Assumptions

## Analytical Rules

### IS-LM-FE Framework Rules
1. **Short-run equilibrium**: Intersection of IS and LM curves
2. **Long-run equilibrium**: All three curves (IS, LM, FE) intersect
3. **Adjustment mechanism**: If Y ≠ FE, price level adjusts over time (not modeled in this exercise)

### Policy Response Rules

**Federal Reserve:**
- **Dual mandate**: Price stability (~2% inflation) and maximum employment
- **Taylor Rule (implicit)**: Rate decisions balance inflation gap and output gap
- **Independence constraint**: Political pressure exists but Fed maintains formal independence

**ECB:**
- **Primary mandate**: Price stability (inflation target ~2%)
- **Current posture**: Accommodative (7 cuts in 8 meetings)
- **Constraint**: Already in easing cycle, limited room for further cuts

**Central Bank of China:**
- **Implicit mandate**: Support growth and employment
- **Current posture**: Fiscal measures prioritized over monetary

## Economic Constraints

### U.S. Constraints
1. **Inflation constraint**: At 4.4-4.6%, well above target → limits rate cut ability
2. **Supply constraint**: "Covid-like interruptions" may reduce productive capacity
3. **Uncertainty constraint**: Investment decisions frozen until tariff policy clarifies
4. **Political constraint**: Presidential pressure on Fed (Trump's April 17 statement)

### E.U. Constraints
1. **Export dependency**: Vulnerable to U.S. demand shocks
2. **Fiscal implementation lag**: Germany's €500B fund delayed to 2026
3. **China trade exposure**: 21% of imports from China → vulnerable to redirection effects
4. **Exchange rate**: Stronger euro reduces export competitiveness but lowers import inflation

### China Constraints
1. **Structural weakness**: Property crisis limits effectiveness of stimulus
2. **Export dependency**: Heavy reliance on exports makes tariffs highly damaging
3. **Domestic demand**: "Stubbornly weak" consumption limits internal growth engine
4. **Tariff magnitude**: 145% rate is near-prohibitive for most goods

## Key Assumptions

### Explicit Assumptions
1. **Tariff permanence**: Analysis assumes tariffs remain in place for "rest of 2025"
2. **No escalation**: No indication of further tariff increases beyond April 2 levels
3. **Central bank independence**: Fed, ECB, and PBOC can make independent decisions (despite political pressure)

### Implicit Assumptions
1. **Rational expectations**: Markets and consumers form expectations based on available information
2. **No major external shocks**: Analysis focuses on tariff shock, assumes no other major disruptions
3. **Policy transmission**: Monetary and fiscal policies affect economy through standard channels
4. **Model validity**: IS-LM-FE framework adequately captures short-run dynamics

### Ambiguous Assumptions (See Risks section)
- Duration of "wait-and-see" consumer behavior
- Magnitude of supply chain disruptions
- Effectiveness of China's fiscal measures given structural headwinds
- Degree of capital flight to E.U. assets

# UI/UX and Interaction Requirements (if any)

**Not applicable** - This is an educational case study with no software interface requirements.

The exercise requires:
- Presentation to "institutional investors tomorrow morning"
- Visual communication using IS-LM-FE diagrams (r vs. Y graphs provided in slides)
- Verbal/written explanation of curve movements and policy forecasts

# Technical Requirements and Integration Notes

## Educational/Analytical Requirements

### Required Analytical Outputs
1. **Three IS-LM-FE diagrams** (one per region) showing:
   - Initial equilibrium (IS₀, LM₀, FE₀, Y₀)
   - Curve shifts with directional arrows
   - New equilibrium position
   - Annotations explaining movements

2. **Policy forecasts** for each region:
   - Fiscal response: Yes/No and magnitude
   - Monetary response: Cut/Hold/Raise and magnitude
   - Timing of responses

3. **Economic outcome forecasts**:
   - GDP growth direction and approximate magnitude
   - Inflation trajectory
   - Recession probability (especially for U.S.)

### Data Sources Referenced
- **Trade War Tracker** (source for tariff timeline chart)
- **Financial Times** (April 25, 2025 article)
- **New York Times** (April 7, 2025 articles)
- **Wall Street Journal** (April 22, 30, 2025 articles)
- **Bloomberg** (April 4, 2025 TV segment and articles)
- **CBS** (April 17, 2025 - Trump statement)
- **Federal Reserve Banks** (Richmond Fed business survey)
- **Company earnings calls** (P&G CFO statement)

### Integration with Course Material
- Assumes prior knowledge of IS-LM-FE framework
- Builds on macroeconomic policy analysis concepts
- Applies theoretical models to current events (as of Spring 2025 teaching date)

# Risks, Ambiguities, and Missing Information

## Critical Ambiguities

### U.S. Analysis Gaps
1. **Question**: What is the exact
