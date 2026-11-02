import type { Regime } from "@/lib/macro/model";

/** A playable lab on a lesson page: which economy, which shocks, which one starts selected. */
export type LabSpec = {
  regime: Regime;
  /** Capital mobility for open economies, 0 (none) to 1 (perfect). */
  mobility?: number;
  /** Regimes the reader may toggle between on the page (default: closed/floating when the lab starts closed). */
  regimes?: Regime[];
  shocks: string[];
  defaultShock: string;
};

/** One part of a written lesson: a heading, short paragraphs, and optionally an interactive piece by id. */
export type Section = { heading: string; paras: string[]; widget?: string; widgetNote?: string };

/** A multiple-choice prediction check: the reader commits to an answer, then sees why. */
export type Prediction = { q: string; options: string[]; answer: number; why: string };

/** A row of a news-to-model table. Headlines are invented examples, not quotations. */
export type NewsRow = { headline: string; driver: string; curve: string; effect: string };

/** A worked real-world case. Numbers are public facts from memory and marked approximate. */
export type Case = { heading: string; text: string; approx: string };

/** A real case drawn as a cause chain that lights up link by link. Dates and numbers are from memory and marked approximate. */
export type ChainCase = { heading: string; when: string; text: string; links: string[]; curves: string; approx: string };

export type Lesson = {
  /** 1 to 13; the Practice page is 0 and is not numbered. */
  n: number;
  slug: string;
  part: number;
  title: string;
  summary: string;
  kind?: "lesson" | "practice";
  /** What the lesson will cover; shown on lessons whose text is not written yet. */
  covers: string[];
  /** Written lesson text, when it exists. */
  body?: string[];
  takeaways?: string[];
  lab?: LabSpec;
  /** Written sections with interactive widgets, shown after the reading text. */
  sections?: Section[];
  predictions?: Prediction[];
  /** Column names for the news table: headline, driver, curve, effect. */
  newsColumns?: [string, string, string, string];
  news?: NewsRow[];
  cases?: Case[];
  /** Cases drawn as animated cause chains. */
  chains?: ChainCase[];
  /** Heading for the chain cases, if the lesson has them. */
  chainsHeading?: string;
};

export const parts = [
  { n: 1, title: "The building blocks", blurb: "How to measure an economy, and what drives output, saving, prices and jobs." },
  { n: 2, title: "The IS-LM-FE model", blurb: "Three curves, a recipe for shocks, and how an economy finds its way home." },
  { n: 3, title: "The open economy", blurb: "Exchange rates, trade, tariffs and the flow of capital across borders." },
  { n: 4, title: "Practice", blurb: "Mixed problems that put the whole toolkit to work." },
];

export const lessons: Lesson[] = [
  {
    n: 1, slug: "measuring-the-economy", part: 1, title: "Measuring output and prices",
    summary: "What GDP and inflation actually count, so headline numbers read as model inputs.",
    covers: ["What GDP adds up, and the expenditure identity", "Nominal against real values, and price indexes", "Employment, unemployment and the labour force"],
    body: [
      "Before any curve appears, it helps to know what the headline numbers count. A report that GDP fell 0.3 percent, or that consumer prices rose 3 percent, is a statement about how output and prices were measured. Later lessons treat the first as a change in output Y against its full-employment level, and the second as a change in the price level P. Those readings only make sense if you know what the measures include and leave out.",
      "Gross domestic product is the market value of the final goods and services produced inside a country in a period. Three words do the work. Market value means each good is weighed by its price, so cars and haircuts can be added. Final means goods bought to be used, not goods bought to be turned into something else. Produced means newly made this period, so selling an old house is not output.",
      "Everything below uses invented numbers. They are there so you can see the arithmetic, not as data about any country.",
    ],
    takeaways: [
      "GDP can be counted from production (value added), from spending on final goods, or from the income that production creates. The three totals are equal by construction.",
      "Y = C + I + G + NX. Imports are inside C, I and G, then removed once through the minus sign in NX, so imports alone do not lower GDP.",
      "Nominal GDP changes with prices and quantities; real GDP holds prices at a base year, so changes in it are changes in output. The base year matters when relative prices move.",
      "A price index prices a fixed basket. Substitution, quality change and new goods all make a fixed basket overstate the rise in the cost of living.",
    ],
    sections: [
      {
        heading: "Three ways to count the same output",
        paras: [
          "Take an economy with two firms. A farm grows oranges and sells all of them to a juice maker. The juice maker squeezes them and sells glasses of juice to households. What is the economy's output?",
          "Production approach. Add up each firm's value added, which is its sales minus what it bought from other firms. The farm adds the whole value of its oranges. The juice maker adds the value of the juice minus the cost of the oranges. Together this equals the value of the juice alone, because the oranges are already inside the juice price. Adding both firms' sales instead would count the oranges twice.",
          "Expenditure approach. Add up spending on final goods. Households buy the juice, so that is consumption. If some juice sits unsold in the warehouse, count it as investment in inventories, as if the firm had bought its own unsold stock. Then spending equals the value of what was made.",
          "Income approach. Every dollar of value added is paid out as wages to workers or kept as profit by owners. Add up all incomes and you get the same total again. Try it: change any price or quantity and watch the bars.",
        ],
        widget: "three-ways",
      },
      {
        heading: "Spending, sorted",
        paras: [
          "The expenditure approach splits final spending into four groups. Consumption C is household spending on new goods and services. Investment I is spending on new capital, new housing and additions to inventories. Government purchases G are what governments buy, including the wages of their workers. Net exports NX are exports minus imports. Together, Y = C + I + G + NX.",
          "Two kinds of transaction fall outside the sum. Transfers such as pensions move money without buying output. Sales of things that already exist, such as a used car or a share of stock, move ownership without making anything new. Only the fee a dealer or broker earns for arranging the sale is new output.",
        ],
        widget: "expenditure-sorter",
      },
      {
        heading: "Why imports subtract and why that is not a loss",
        paras: [
          "People spend on foreign goods as well as home goods, and the survey of spending cannot tell the two apart in the first three terms. So C, I and G include the imported part. GDP is meant to measure home production, so the identity subtracts imports once, inside NX. A foreign-made coat bought for 200 adds 200 to C and takes 200 away through IM. It contributes nothing to GDP, which is right because nobody at home produced it.",
          "This is why the minus sign is a bookkeeping device and not a statement that imports damage the economy. GDP falls with imports only when the purchase replaces something made at home. If a household buys the coat instead of a home-made one, the home-made coat is not produced and GDP falls by its value. The lost output is the cause, not the import figure. In the real data, the timing of imports and stock-building can also differ across quarters, so a large import number in one quarter can be partly offset by inventories or spending elsewhere.",
        ],
        widget: "imports-demo",
      },
      {
        heading: "Nominal and real",
        paras: [
          "Nominal GDP values this year's output at this year's prices. It can rise because more is made, because prices rose, or both. To separate the two, real GDP values each year's quantities at the prices of one fixed base year. If real GDP rose, quantities rose, since prices are held still.",
          "The GDP deflator is nominal GDP divided by real GDP, times 100. It is a price index covering everything produced. In the base year real and nominal are equal and the deflator is 100.",
          "The choice of base year matters when prices move by different amounts. A good that gets much cheaper while its output booms, like a phone, is weighed heavily with early dear prices and lightly with late cheap ones. Statistical agencies deal with this by updating the base year as they go, a method called chain-weighting.",
        ],
        widget: "real-nominal",
      },
      {
        heading: "Prices and the consumer price index",
        paras: [
          "A consumer price index asks how much a fixed basket of goods costs now compared with a base year. If the basket cost 1,160 in year 0 and costs 1,304 in year 1, the index rose by 100 × (1,304/1,160 − 1), about 12.4 percent. The inflation rate is the percentage change in the index.",
          "Holding the basket fixed makes the index easy to compute and also makes it overstate the true rise in the cost of living, for three reasons. Substitution bias: when beef becomes dearer, households buy more chicken, so the fixed basket overstates how much more they must spend to be as well off. Quality bias: if a laptop costs more because it is faster, part of the higher price buys more, not the same thing for more. New-goods bias: products that appear after the base year are missing from the basket, so the gain from having them never shows up.",
          "A US commission chaired by Michael Boskin reported in the mid-1990s that the consumer price index overstated yearly inflation by roughly one percentage point, with quality change and new products the largest part of it. Statistical agencies have since changed their methods, so this is a result about a past index, not a current figure.",
        ],
        widget: "cpi-basket",
      },
      {
        heading: "Reading the numbers as model inputs",
        paras: [
          "From the next lesson on, real GDP is the model's output Y and the price index is its price level P. A headline about real GDP falling is a statement about Y; a headline about inflation is a statement about how fast P is changing. Keep two warnings in mind. A first estimate of GDP is revised later, sometimes by a lot. And the measures describe what is sold in markets, so they say little about unpaid housework, leisure, or the environment.",
        ],
      },
    ],
    predictions: [
      { q: "Nominal GDP rises 5 percent. The deflator rises 5 percent. What happened to real GDP?", options: ["It rose about 5 percent", "It was roughly unchanged", "It fell about 5 percent"], answer: 1, why: "Real GDP is nominal GDP divided by the price index, so a 5 percent rise in both leaves real output about where it was." },
      { q: "A family buys a house that was built and sold for the first time this year. What does this do to this year's GDP?", options: ["Nothing, because houses are not goods", "It adds to investment I", "It adds to consumption C"], answer: 1, why: "New housing counts as investment. Had the house been built long ago, only the agent's fee would be new output." },
      { q: "Beef gets much dearer and households eat more chicken. Compared with the true change in the cost of living, a fixed-basket index will…", options: ["understate it", "overstate it", "get it exactly right"], answer: 1, why: "The fixed basket still contains the beef households have stopped buying, so it shows a bigger rise than they actually face." },
      { q: "Households buy more imported coats and spend less on home-made ones, with everything else unchanged. GDP…", options: ["is unchanged, because imports are subtracted anyway", "falls, by the value of the home-made coats not produced", "rises, because consumption rose"], answer: 1, why: "Total spending did not change, but the home-made coats are no longer produced. The minus sign on imports takes out the foreign coats; the lost home production is the fall." },
      { q: "A factory makes goods it cannot sell and puts them in its warehouse. Output was counted this year because…", options: ["unsold goods are counted as investment in inventories", "the factory's workers still got paid, so it is a transfer", "it is not counted until it is sold"], answer: 0, why: "Production is measured when it is made. The unsold stock appears as inventory investment, which keeps spending equal to output." },
    ],
    newsColumns: ["In the news", "What is being measured", "Model variable", "How to read it"],
    news: [
      { headline: "Real GDP shrank by 0.3 percent last quarter after a rise of 0.8 percent the quarter before.", driver: "Change in real output", curve: "Y (against Y*)", effect: "Output fell. Whether the economy is below full employment depends on where Y started relative to Y*." },
      { headline: "Consumer prices were 3 percent higher than a year ago.", driver: "Change in a fixed-basket price index", curve: "P", effect: "The price level rose 3 percent. It may overstate the true rise in the cost of living because of substitution and quality bias." },
      { headline: "Imports hit a record, and analysts say the economy contracted as a result.", driver: "Imports inside the identity", curve: "NX, C, I", effect: "Imports are subtracted from a total that also includes them. Look for what fell at home: ask whether home production was replaced or only the accounting moved." },
      { headline: "Nominal output rose 6 percent in a year with 4 percent inflation.", driver: "Nominal against real", curve: "Y", effect: "Real output rose about 2 percent. Nominal growth alone does not say how much more was made." },
      { headline: "Retailers pile up unsold stock as holiday sales disappoint.", driver: "Inventory investment", curve: "I (and later Y)", effect: "The unsold goods count as investment now. Output is high today but firms will probably cut production later." },
    ],
    cases: [
      {
        heading: "A quarter in which imports surged ahead of tariffs",
        text: "In the first quarter of 2025 the first US estimate showed real GDP slightly negative at an annual rate, around minus 0.3 percent, while imports jumped as importers bought ahead of expected tariffs. Commentators said the imports had dragged GDP down. The identity shows why this is only half the story: imported goods that were bought by firms and held in stock appear as inventory investment, which is added, and the same goods are subtracted through imports. The import surge changed how output was recorded far more than it changed how much was produced at home. Later estimates revised the quarter, and the size of the effect depends on the revision.",
        approx: "From memory and approximate: the sign and rough size of the first estimate, the surge in imports, and the later revisions should be checked against the US Bureau of Economic Analysis releases.",
      },
      {
        heading: "How much did the price index overstate inflation",
        text: "The Boskin Commission of 1996 estimated that the US consumer price index overstated the yearly rise in the cost of living by a little over one percentage point, with a range of roughly 0.8 to 1.6. It split the gap into substitution across goods, shopping at different kinds of store, and new products and quality, with the last the biggest. A gap that size matters because pensions and tax brackets were tied to the index. After the report, statistical agencies updated their methods, so a gap of that size is no longer what current methods imply.",
        approx: "From memory and approximate: the central estimate of about 1.1 points, the range, and the ranking of the sources should be checked against the commission's 1996 report.",
      },
    ],
  },
  {
    n: 2, slug: "productivity-growth", part: 1, title: "Productivity and growth",
    summary: "Why output per worker rises, and what it does to wages and living standards.",
    covers: ["The production function and what moves it", "Capital, labour and productivity", "Growth over decades compared with swings over quarters"],
    body: [
      "Over decades, what separates a rich country from a poor one is how much each worker produces. Over quarters, output bounces around a trend; over generations, the trend itself is what changes living standards. This lesson looks at where output comes from, and why the thing economists call productivity matters so much.",
      "The model's supply side is a production function. Output Y depends on the capital stock K, the number of workers N, and a productivity term A that captures everything else: technology, organisation, skills, institutions. The version used here is Y = A × K^a × N^(1−a), where a is a number between 0 and 1 giving capital's share of income. Values below are in index units, not data.",
    ],
    takeaways: [
      "Output rises with labour but at a falling rate: the marginal product of labour (MPL) diminishes.",
      "A firm hires until the MPL falls to the real wage. The MPL curve is therefore the demand for labour.",
      "More A or more K raises the MPL at every level of employment, so labour demand shifts right.",
      "Growth accounting splits output growth into capital, labour, schooling and a residual, total factor productivity (TFP). A country can grow fast mostly by adding inputs, which cannot go on forever.",
      "A rise in A today moves the FE line to the right.",
    ],
    sections: [
      {
        heading: "The production function",
        paras: [
          "Hold capital and productivity fixed and draw output against the number of workers. The curve rises, because more workers make more. It also flattens, because each new worker has the same machines to share. The slope of the curve at any point is the marginal product of labour, MPL: the extra output from hiring one more worker. That is diminishing marginal product.",
          "The three sliders each do something different. Raising A lifts the whole curve and steepens it, so the same workers make more. Raising K does the same through machines. Changing a changes how much capital matters relative to labour. Try each one and keep an eye on the tangent line.",
        ],
        widget: "production-function",
      },
      {
        heading: "Hire until the marginal worker pays for themselves",
        paras: [
          "A firm that pays a real wage w, measured in units of output, gains from hiring a worker whenever that worker adds more than w. As employment grows the MPL falls. So the firm keeps hiring until the MPL has fallen to the wage. Stopping earlier leaves profit on the table; going on costs more than it brings in.",
          "Turn that around. For each wage the firm picks the number of workers at which MPL equals w, so the MPL curve read sideways is the firm's demand for labour. Summed across firms, it is the economy's labour demand. When A or K rises, the MPL curve moves up and labour demand shifts right: at any wage, firms want more workers. The labour lesson combines this with labour supply.",
        ],
        widget: "hiring",
      },
      {
        heading: "Growth accounting",
        paras: [
          "Take the production function and ask how fast each input grew. Growth in output is approximately the growth in A, plus a times the growth in capital, plus (1 − a) times the growth in labour. Capital and labour growth can be measured. Growth in A cannot be observed directly, so it is computed as what is left over: the part of output growth that more capital and labour do not explain. That residual is total factor productivity growth, TFP.",
          "Labour can be split further. More workers raise labour input, and so does more schooling per worker. The calculator keeps those apart. Choose a preset or set your own numbers.",
        ],
        widget: "growth-calc",
      },
      {
        heading: "Input-led growth and TFP-led growth",
        paras: [
          "In a well-known 1995 study, Alwyn Young applied growth accounting to Hong Kong, Singapore, South Korea and Taiwan. Their output growth was among the fastest in the world for a quarter of a century. Young found that much of it came from putting more resources to work: a rising share of the population in jobs, more years of schooling, and a high investment rate that raised the capital stock quickly. Measured TFP growth was modest, and for Singapore close to zero, while it was larger for Hong Kong and Taiwan.",
          "The lesson is about the source of growth. Growth from adding inputs runs into diminishing returns and a limit on how many more people can join the workforce or stay in school. Growth from TFP does not use up anything, and it is what lasts. The first preset in the calculator is stylised after the input-led pattern; the second shows a case where about half of growth is the residual. Both are rounded teaching numbers, not data.",
        ],
      },
      {
        heading: "Where this leads",
        paras: [
          "Productivity raises output per worker, and it raises the wage that labour demand supports. In the IS-LM-FE picture, a rise in A today raises the output the economy can make at full employment, so the FE line shifts right. The labour lesson shows how the labour market delivers it.",
        ],
        widget: "fe-handoff",
      },
    ],
    predictions: [
      { q: "A firm's marginal product of labour is 0.8 and the real wage is 0.6. What should it do?", options: ["Hire more workers", "Keep its workforce", "Lay off workers"], answer: 0, why: "The next worker adds more than they cost. The firm should keep hiring until MPL falls to the wage." },
      { q: "A new technology raises A in every firm. What happens to labour demand?", options: ["It shifts right: at each wage firms want more workers", "It shifts left, because machines replace workers", "It does not change, since the wage is unchanged"], answer: 0, why: "A higher A raises the MPL at every level of employment. Since firms hire until MPL equals the wage, they want more workers at each wage." },
      { q: "A firm has 100 workers and the wage rises. With K and A unchanged, it will…", options: ["hire fewer workers, moving up the MPL curve", "hire more, because output per worker is higher", "keep 100, since the MPL curve has not moved"], answer: 0, why: "A higher wage is a move along the demand curve: employment falls until the MPL is as high as the new wage." },
      { q: "Employment grows 2 percent a year, capital grows 4 percent, and a = 0.3. Output grows 4 percent. TFP growth is about…", options: ["1.4 percent", "0 percent", "2.6 percent"], answer: 0, why: "Capital explains 0.3 × 4 = 1.2 points and labour 0.7 × 2 = 1.4 points, 2.6 in all. The residual is 4 − 2.6 = 1.4." },
      { q: "A country's growth is nearly all explained by more capital, workers and schooling. What follows?", options: ["Growth will probably slow when the inputs stop growing as fast", "Growth is permanent, since capital keeps rising", "TFP must be growing quickly"], answer: 0, why: "Inputs run into diminishing returns and limits. Only productivity growth can keep output per worker rising indefinitely." },
    ],
    newsColumns: ["In the news", "Driver", "Where it moves", "Effect"],
    news: [
      { headline: "A new software tool lets small firms do in a day what took a week.", driver: "A rises", curve: "MPL and labour demand shift right; FE moves right", effect: "Output and wages can both rise at full employment." },
      { headline: "A wave of factory building doubles the stock of machines per worker in a region.", driver: "K rises", curve: "MPL up; labour demand right", effect: "Each worker produces more, and firms want more workers at any wage." },
      { headline: "A government study finds a country's growth came mostly from more schooling and a bigger workforce.", driver: "Growth accounting", curve: "Not a shift: a decomposition", effect: "Growth driven by inputs, with a small TFP share, may not continue at the same pace." },
      { headline: "Wages rise sharply in a labour-intensive industry while productivity is unchanged.", driver: "Higher w", curve: "Movement along labour demand", effect: "Firms in that industry hire fewer workers." },
      { headline: "A natural disaster destroys a quarter of a region's factories.", driver: "K falls", curve: "MPL down; labour demand left", effect: "Output and the demand for workers fall until the capital is rebuilt." },
    ],
    cases: [
      {
        heading: "Input-led growth in East Asia",
        text: "Young (1995) is a growth-accounting study of Hong Kong, Singapore, South Korea and Taiwan between the mid-1960s and about 1990. Output grew at roughly 7 to 10 percent a year. Young's central finding was that most of this was due to rapid growth in inputs: more people at work, better-educated workers and a very high investment rate. His estimates of TFP growth were low, about 0.2 percent a year for Singapore and around 2 to 2.5 percent for Hong Kong and Taiwan, closer to the rates in rich countries. His conclusion was that the rapid growth was less of a productivity miracle than it looked, and that inputs could not keep growing at those rates indefinitely.",
        approx: "From memory and approximate: output growth ranges and the TFP figures for each economy should be checked against the paper. Later work disputes some of the estimates, and results depend on how capital and labour are measured.",
      },
      {
        heading: "A productivity-led case",
        text: "Between the mid-1990s and the early 2000s, US output per hour worked grew faster than in the previous two decades. Many studies attributed a good part of the pickup to faster TFP growth in making and using information technology, rather than to a sudden jump in the capital stock or the workforce. The second preset in the calculator is stylised after this kind of pattern, with growth where about half of the total is the residual.",
        approx: "From memory and approximate: the timing and the share attributed to TFP differ by study. The calculator preset is a stylised illustration and is not US data.",
      },
    ],
  },
  {
    n: 3, slug: "unemployment", part: 1, title: "The labour market and full employment",
    summary: "How the labour market sets full-employment output, why the FE line is vertical, and what unemployment is.",
    covers: ["Labour demand, labour supply and the real wage", "Taxes on work", "Frictions, and unemployment above its natural level"],
    body: [
      "The first two lessons gave you output and the production function. This one finds out how much the economy produces when its labour market works as it should, and why that level does not depend on the interest rate. That level is full-employment output, Y*, drawn as the FE line.",
      "The labour market has two sides. Firms demand workers up to the point where the marginal product of labour equals the real wage, so the MPL curve is labour demand. Households supply labour by comparing what an hour of work earns with what an hour of leisure is worth, so labour supply responds to the after-tax real wage. The real wage and employment at which the two meet fix employment N*, and the production function then fixes Y* = A × K^a × N*^(1−a). All numbers here are index units.",
    ],
    takeaways: [
      "Labour demand is the MPL curve; labour supply rises with the after-tax real wage. They meet at the full-employment wage and employment N*.",
      "Full-employment output Y* is the output made with N*. Higher A, higher K or more labour supply move FE right; a higher labour tax moves it left.",
      "FE is vertical in (Y, r) because today's interest rate does not change today's capital stock, productivity or labour supply. Investment now becomes capital only later.",
      "Full employment means unemployment at its natural rate, frictional plus structural, not zero. Cyclical unemployment is the part above that, and Okun's law ties it to the output gap.",
      "The Phillips curve links unemployment and inflation, and it shifts up one for one with expected inflation.",
    ],
    sections: [
      {
        heading: "Labour demand, labour supply and the FE line",
        paras: [
          "Start with the labour market in the first panel below. The demand curve slopes down because of diminishing marginal product. The supply curve slopes up because a higher after-tax wage draws more people into work. Where they cross are the full-employment wage and employment. Read that employment off the production function in the second panel and you have full-employment output. The third panel draws it as a vertical line on the IS-LM chart.",
          "Use the sliders to move each driver and check where the three panels move. A or K raises the MPL, so labour demand moves right, employment and the wage rise, and Y* rises. More willing workers shifts supply right: employment and Y* rise but the wage falls. A higher tax on labour income shifts supply left, because for any gross wage the after-tax pay is lower: employment and output fall, and the gross wage firms pay rises. IS and LM do not move at all.",
        ],
        widget: "linked-panels",
      },
      {
        heading: "Why FE is vertical",
        paras: [
          "Every term in Y* = A × K^a × N*^(1−a) is fixed by something other than the real interest rate. Productivity A is technology. The capital stock K is what has been built up so far. Employment N* comes from the labour market. A higher interest rate discourages investment, but investment this year adds to capital only next year, so it does not alter this year's K. That is why the FE line is vertical: at any r, output at full employment is the same. In the longer run, extra investment does build capital and moves FE right, which is why a change in desired investment matters for later periods even though it does not shift FE today.",
        ],
      },
      {
        heading: "Taxing work and the Laffer curve",
        paras: [
          "A tax on wages drives a wedge between what the employer pays and what the worker keeps. Workers respond to what they keep. A higher tax lowers employment and so lowers Y*. Tax revenue is the rate times the wage bill. At a zero rate it is zero; at a very high rate so few people work that it is small again. In between there is a rate that raises most. That hump is the Laffer curve.",
          "Where the peak lies depends on how strongly labour supply responds. If workers respond a lot, the peak is at a lower rate. The model can tell you the shape but not where a real country sits, which is a matter for evidence.",
        ],
        widget: "laffer",
      },
      {
        heading: "Frictional, structural and cyclical unemployment",
        paras: [
          "Not everyone without a job is out of work because of a recession. Frictional unemployment is the time it takes workers and firms to find each other, which exists even in a healthy economy as people change jobs and enter the labour force. Structural unemployment is a lasting mismatch between workers' skills or locations and the jobs on offer, or from rules and wages that keep some jobs from being created. Together they make up the natural rate of unemployment. Cyclical unemployment is whatever lies above that, in a slump.",
          "Full employment therefore means output at the natural rate of unemployment. Y* is output when unemployment is at the natural rate, not when everyone has a job. The natural rate is not observed directly and it changes slowly over time.",
        ],
      },
      {
        heading: "Okun's law",
        paras: [
          "When unemployment is above its natural rate, output is below Y*. In a commonly used rule of thumb, every point of unemployment above the natural rate goes with about 2.5 percent of output below FE. The coefficient is bigger than one because when output falls, hours, participation and productivity fall too, not just employment. The estimated coefficient differs across countries and periods, so use the slider.",
        ],
        widget: "okun",
      },
      {
        heading: "The Phillips curve with expectations",
        paras: [
          "Unemployment and inflation are linked. When unemployment is below the natural rate, wages and prices tend to rise faster than people expected. When it is above, they rise more slowly. A simple form is inflation = expected inflation − β × (u − natural rate). At the natural rate, inflation equals expected inflation. If people come to expect more inflation, the whole curve shifts up one for one, which is why the early view that policy could hold unemployment permanently below natural by accepting a little more inflation did not survive the 1970s.",
        ],
        widget: "phillips",
      },
    ],
    predictions: [
      { q: "A cut in the tax on wages raises the after-tax wage at each gross wage. What happens to FE?", options: ["It moves right", "It moves left", "It does not move"], answer: 0, why: "More people are willing to work, so labour supply shifts right, employment and full-employment output rise." },
      { q: "A wave of retirements reduces the number of people willing to work at each wage. What happens to FE and the real wage?", options: ["FE moves left, and the real wage rises", "FE moves left, and the real wage falls", "FE moves right, and the real wage rises"], answer: 0, why: "Labour supply shifts left. Employment falls and so does output, and with fewer workers the marginal product, and so the wage, rises." },
      { q: "The central bank raises the interest rate. What happens to the FE line?", options: ["Nothing: FE does not depend on r", "It moves left, since investment falls", "It moves right, since saving rises"], answer: 0, why: "A, K and labour supply are all unchanged today. Lower investment affects capital next period, not this one." },
      { q: "Unemployment is 7 percent and the natural rate is 5 percent. With an Okun coefficient of 2.5, output is…", options: ["5 percent below FE", "2 percent below FE", "7.5 percent above FE"], answer: 0, why: "Two points above natural times 2.5 gives 5 percent below FE." },
      { q: "People start to expect 5 percent inflation instead of 2. With unemployment at the natural rate, actual inflation is…", options: ["about 5 percent", "still about 2 percent", "zero"], answer: 0, why: "At the natural rate, inflation equals expected inflation, so the whole Phillips curve has shifted up by 3 points." },
    ],
    newsColumns: ["In the news", "Driver", "Where it moves", "Effect"],
    news: [
      { headline: "The government cuts payroll taxes on workers' earnings.", driver: "Labour tax falls", curve: "Labour supply right; FE right", effect: "More employment and full-employment output; the wage employers pay falls a little." },
      { headline: "A large group of workers retires faster than expected.", driver: "Labour supply falls", curve: "Labour supply left; FE left", effect: "Full-employment output falls and wages rise." },
      { headline: "Factories adopt robots that raise output per worker.", driver: "A rises", curve: "Labour demand right; FE right", effect: "Output and wages rise at full employment." },
      { headline: "The central bank lifts its interest rate by half a point.", driver: "Monetary policy", curve: "LM, not FE", effect: "Short-run output and the interest rate change. Full-employment output does not move today." },
      { headline: "Unemployment jumps to 9 percent, far above what economists think is normal.", driver: "Cyclical unemployment", curve: "Output below FE", effect: "By Okun's rule of thumb, output is a few times that gap, roughly 10 percent, below FE if the natural rate is 5." },
    ],
    cases: [
      {
        heading: "US unemployment through the pandemic",
        text: "The US unemployment rate stood near 3.5 percent in early 2020, jumped to about 14.8 percent in April 2020 as businesses closed, and then fell back quickly: to about 6.7 percent by December 2020, to below 4 percent by the end of 2021, and to around 3.5 percent through much of 2022 and 2023. By 2024 and 2025 it had drifted up to roughly 4 to 4.3 percent. The widget plots selected months. The speed of the recovery was unusual because a large share of the unemployed had been temporarily laid off rather than permanently separated, and they were recalled when businesses reopened.",
        approx: "From memory and approximate to a few tenths of a point: all monthly values, and the descriptions of 2024 and 2025. The widget plots selected months rather than the full series, and this lesson was written before any of the latest releases could be checked. Check the BLS series LNS14000000 before relying on a figure.",
      },
    ],
  },
  {
    n: 4, slug: "saving-investment", part: 1, title: "Saving, investment and the IS curve",
    summary: "Build the IS curve from the market for saving and investment, and trace every shifter.",
    covers: ["Desired saving and what shifts it", "Desired investment and what shifts it", "The real interest rate that clears the market"],
    body: [
      "The IS curve answers one question: for each level of output, at what real interest rate does the goods market clear? In this model the goods market clears when what people want to save equals what firms want to invest. Build the curve from that market and every news item about spending, confidence, wealth or the budget has a place to land.",
      "Desired saving comes from households and the government. Desired investment comes from firms deciding how much capital to add. Both respond to the real interest rate r, and saving also responds to income. Everything below uses index units, not data.",
    ],
    takeaways: [
      "Households smooth consumption: a temporary income change is mostly saved or borrowed against, a permanent one is mostly spent, and a wealth change is spread over the years ahead.",
      "National saving is private saving plus government saving: S = S_private + (T − G).",
      "Desired investment rises with the expected future productivity of capital and falls with r, with depreciation and with taxes on investment.",
      "IS is every (Y, r) pair at which desired saving equals desired investment. Higher Y raises saving, so r must fall: IS slopes down.",
      "Anything that lowers desired saving or raises desired investment at a given r shifts IS right; the opposite shifts it left.",
      "Whether a tax cut shifts IS depends on how much of it households save. That is the question behind Ricardian equivalence, and it is still debated.",
    ],
    sections: [
      {
        heading: "Why households smooth",
        paras: [
          "Most people would rather spend a similar amount each year than feast one year and starve the next. So spending follows lifetime resources, not this year's pay. Think of the whole stream of income you expect, plus any wealth you have, and spread it across the years you will live. Two shocks look alike in this year's paycheque and are very different in lifetime terms.",
          "An income shock that lasts one year is a small change to lifetime resources, so most of it is saved. An income shock that lasts for good is a large change, so spending follows it one for one. A wealth shock, such as a rise in the value of a house, is spread across the remaining years. Try all three.",
        ],
        widget: "smoothing",
      },
      {
        heading: "Saving, public and private",
        paras: [
          "Private saving is what households keep from their income after taxes and consumption. Government saving is the difference between taxes and government purchases, T − G. It is negative when there is a deficit. Total desired saving is the sum, and it is what is available to fund investment. Saving increases when interest rates are higher, because the reward to waiting rises, and it increases with current income.",
          "Several things change desired saving at a given r. People who expect higher income in future spend more today, so saving falls. Greater wealth lowers saving out of income. A rise in government purchases lowers public saving. A rise in taxes raises public saving by the full amount, while private saving falls by only part of it, so total saving rises.",
        ],
      },
      {
        heading: "Investment",
        paras: [
          "Firms add capital as long as an extra unit earns more than it costs. The return is the expected future marginal product of capital, the MPK, reduced by taxes on investment. The cost is the real interest rate, which is the price of funds, plus depreciation, the share of the machine that wears out. So desired investment falls when r rises, when depreciation rises, or when taxes on investment rise, and it rises when firms expect capital to be more productive next period. Expected future productivity can change because of new technology or an improved business outlook.",
        ],
      },
      {
        heading: "Building IS point by point",
        paras: [
          "Put desired saving and desired investment on one diagram with r on the vertical axis. Saving rises with r and investment falls with r. They cross at the interest rate that clears the market. That rate depends on income, because income shifts saving: with higher income, saving is higher at every r, so the crossing moves to a lower interest rate. Each output level and the r that clears the market at that output are one point on IS. Collect them and the curve slopes down.",
        ],
        widget: "saving-market",
      },
      {
        heading: "Every IS shifter",
        paras: [
          "A change in anything other than Y and r shifts a curve in the market and with it IS. Five are played below: expected future productivity, expected future income, wealth, government purchases and taxes. The sixth, net exports, enters when the economy is opened in the later lessons. Each comes with its cause chain. Read the chain from left to right as the picture moves.",
        ],
        widget: "is-shifters",
      },
      {
        heading: "Ricardian equivalence, an open question",
        paras: [
          "Suppose the government cuts taxes today and borrows to cover the gap. The debt has to be repaid, so taxes will be higher later. A household that sees this might save the whole cut to pay the future bill. If so, total saving does not change: public saving falls by exactly what private saving rises, and IS does not move. This is Ricardian equivalence. A household that does not look ahead, or cannot borrow when it wants to, spends much of the cut, and IS shifts right.",
          "The evidence is mixed. In 2001 and 2008 the US sent rebate cheques to households as part of tax measures. Economists read the same episodes differently: surveys at the time suggested that many people said they would mostly save or repay debt, while studies that followed actual spending found that a sizeable share was spent within a few months. Both readings are consistent with some households smoothing and others spending, so the share f in the widget is a parameter to estimate, not a number the model supplies.",
        ],
        widget: "ricardian",
      },
    ],
    predictions: [
      { q: "A household's pay is raised for one year only. Compared with a permanent raise of the same size, it will spend…", options: ["much less this year", "the same", "much more"], answer: 0, why: "Smoothing spreads a one-year gain over all the years ahead, so most of it is saved." },
      { q: "The government raises its purchases of goods and services and leaves taxes unchanged. What happens to desired saving and to IS?", options: ["Saving falls and IS moves right", "Saving rises and IS moves right", "Saving falls and IS moves left"], answer: 0, why: "Public saving T − G falls, so total saving falls at each r. At the old rate investment exceeds saving, and r has to rise: IS moves right." },
      { q: "Firms expect the machines they buy now to be much more productive next year. What happens?", options: ["The I curve moves right and IS moves right", "The S curve moves right and IS moves left", "Nothing, because r has not changed"], answer: 0, why: "A higher expected MPK raises desired investment at each r, so IS shifts right." },
      { q: "Households learn that their homes are worth much more. What do they do to saving and IS?", options: ["Save less, and IS moves right", "Save more, and IS moves left", "Nothing changes"], answer: 0, why: "Greater wealth lowers desired saving at each r, so IS shifts right. The model also raises money demand, which moves LM in the lesson that follows." },
      { q: "Households believe in full Ricardian equivalence. The government cuts taxes with a deficit. IS…", options: ["does not move", "moves right", "moves left"], answer: 0, why: "Households save the whole cut to meet future taxes, so private saving rises by what public saving falls and total saving is unchanged." },
      { q: "Output rises and everything else is unchanged. What happens to the market-clearing interest rate?", options: ["It falls", "It rises", "It does not change"], answer: 0, why: "Higher income raises desired saving at each r, so the saving curve shifts right and r falls to clear the market. That is the downward slope of IS." },
    ],
    newsColumns: ["In the news", "Driver", "Curve moved", "Effect"],
    news: [
      { headline: "Surveys show households expect their incomes to grow much faster over the next five years.", driver: "Expected future income rises", curve: "S left, so IS right", effect: "Households save less today. Short-run output and r both rise." },
      { headline: "Consumers say they are worried and start putting more aside.", driver: "Expected future income falls, or caution", curve: "S right, so IS left", effect: "Saving rises at each r. Short-run output and r fall." },
      { headline: "Parliament approves a large road-building programme with no tax rise.", driver: "G rises", curve: "S left, so IS right", effect: "Public saving falls. Output and r rise in the short run." },
      { headline: "House prices rise by a fifth in two years.", driver: "Wealth rises", curve: "S left, so IS right", effect: "Households save less. LM also moves, through money demand." },
      { headline: "A tax on new factories is cut.", driver: "Tax on investment falls", curve: "I right, so IS right", effect: "Desired investment rises at each r." },
      { headline: "Firms report that new machines wear out and need replacing faster than expected.", driver: "Depreciation rises", curve: "I left, so IS left", effect: "The net return to capital falls, and investment with it." },
    ],
    cases: [
      {
        heading: "Tax rebates in 2001 and 2008",
        text: "In 2001 the US government sent households rebate cheques of up to a few hundred dollars each as part of a tax-cutting law, worth some tens of billions of dollars. In 2008 it did so again, with larger rebates, about 100 billion dollars in all. Researchers who surveyed households at the time reported that most said they planned to save the money or pay off debts. Researchers who tracked actual spending after the cheques arrived found that households spent a significant fraction of them within a few months, with the share larger for households that were short of cash. Economists therefore disagree about how close households are to the Ricardian benchmark, and they disagree about the number that goes into f.",
        approx: "From memory and approximate: the sizes of the 2001 and 2008 rebate programmes, and the survey and spending shares. Neither source is given here. Check the original studies before quoting a number. The widget uses f as a free parameter for that reason.",
      },
      {
        heading: "Euro-area household saving and a confidence slump",
        text: "Households in the euro area normally saved something like 12 to 13 percent of their disposable income. In 2020, with shops closed and uncertainty high, the rate jumped to a peak above 20 percent, and it stayed well above the old average for several years. Separately, an index of euro-area consumer confidence fell to record lows in 2022, when energy prices soared and inflation rose. In the model, a loss of confidence about the future acts like lower expected future income and greater caution, which raises desired saving at each r and shifts IS to the left. In the data it was accompanied by weak consumer spending.",
        approx: "From memory and approximate: the normal saving rate, the 2020 peak, the persistence of a high saving rate afterwards, and the timing and depth of the 2022 confidence slump. Check the Eurostat and European Commission series before quoting a figure. Saving also rose in 2020 because spending was blocked, which is not the same as a confidence effect.",
      },
    ],
  },
  {
    n: 5, slug: "money-inflation", part: 1, title: "Money and the LM curve",
    summary: "Build the LM curve from the money market, and read a central bank move as a shift of it.",
    covers: ["Money demand and the nominal interest rate", "How the money supply is set", "Inflation, expected inflation and the real rate"],
    body: [
      "The LM curve answers a question about money: for each level of output, at what real interest rate does the amount of money people want to hold equal the amount there is? When a news story says a central bank raised interest rates, this is where it lands in the model: the central bank has chosen a smaller money supply, and the LM curve has moved.",
      "This lesson builds the curve from the money market, step by step, and ends with the tools a central bank uses. The numbers in the figures are index units, not data.",
    ],
    takeaways: [
      "Money serves as a medium of exchange, a unit of account and a store of value. M1 is the most liquid measure; M2 adds assets that are close to money.",
      "Banks create deposits when they lend, so the money supply is the monetary base times a multiplier, about 1 ÷ the reserve ratio with no cash drain.",
      "Nominal money demand is P × L(Y, r + expected inflation, wealth, riskiness and liquidity of other assets, payment technology). Real demand rises with Y and wealth, and falls with the nominal interest rate.",
      "LM is every (Y, r) pair at which real money demand equals real money supply M/P. Raising Y shifts demand right, so r must rise: LM slopes up.",
      "LM moves right when M rises, when expected inflation rises, when other assets become more liquid, or when payment technology improves; it moves left when P rises, wealth rises, or other assets become riskier.",
      "A higher policy rate is a smaller money supply, which is a leftward LM.",
    ],
    sections: [
      {
        heading: "What money is and how it is measured",
        paras: [
          "Money does three jobs. It is a medium of exchange: you can swap it for goods without finding someone who wants what you have. It is a unit of account: prices are quoted in it. And it is a store of value: it keeps purchasing power until you spend it. High inflation damages all three, as the cases below show.",
          "Economists measure the money supply in layers. The narrowest widely used measure, M1, is currency in circulation and balances you can spend straight away, such as chequing deposits. M2 adds assets that are not quite as handy but can be turned into cash quickly, such as savings accounts, small time deposits and retail money-market funds. The exact definitions are set by each central bank and have been revised from time to time. For example, in 2020 the US Federal Reserve moved savings deposits into its M1 measure, so older textbooks draw the line differently.",
        ],
      },
      {
        heading: "How banks create money",
        paras: [
          "Most money is not printed cash. It is deposits in banks. When a bank receives a deposit it keeps a share as reserves and lends the rest. The borrower spends the loan, and the seller deposits it in a bank, which again lends most of it. Each round creates a new deposit that is smaller than the last by the share held as reserves. Add them up and 100 of new reserves can support deposits of 100 ÷ rr, where rr is the reserve ratio.",
          "That is the money multiplier. It shrinks if the public holds more cash, because cash held outside the banks cannot be lent. Central banks do not control the multiplier directly, but they can change the reserve requirement.",
        ],
        widget: "multiplier",
      },
      {
        heading: "Money demand and the LM curve",
        paras: [
          "People hold money because it is convenient for buying things, even though it pays little or no interest. Nominal money demand is MD = P × L(Y, r + expected inflation, wealth, risk and liquidity of other assets, payment technology). It is proportional to the price level, since it takes twice the cash to buy the same things when prices double. The remaining arguments set real demand L.",
          "More income means more purchases, so L rises with Y. A higher nominal interest rate, the real rate plus expected inflation, makes holding money costlier compared with bonds, so L falls. More wealth raises demand for all assets, including money. If other assets become riskier, people want more safe money; if other assets become easier to sell, or if payments technology makes cash less needed, they want less.",
          "Now fix the real money supply M/P at some level and ask which interest rate makes people willing to hold exactly that. Raise Y: demand shifts right, so the rate that clears the market has to rise. Each pair of output and that rate is a point on LM, and the curve slopes up. Every other argument is a shifter. The panel lets you move all of them.",
        ],
        widget: "money-market",
      },
      {
        heading: "Every LM shifter",
        paras: [
          "Anything that changes money demand or real supply at a given output and interest rate shifts LM. The price level is the one that surprises people: when P rises with M fixed, real balances M/P fall, and LM moves left. This is the channel through which prices adjust the economy back to full employment, as the IS-LM-FE lesson shows.",
        ],
        widget: "lm-shifters",
      },
      {
        heading: "Central bank tools",
        paras: [
          "A central bank cannot choose the money supply, the interest rate and the price level separately. In practice most set a short-term policy rate and supply whatever reserves are needed to hold it. That is why a rate rise in the news is, in the model, a tightening of the money supply.",
          "The four classic tools differ in how they get there. Open market operations buy or sell government bonds. The policy rate is the target for interbank lending. The discount rate is the price of borrowing reserves from the central bank. Reserve requirements change the multiplier. The Taylor rule, which asks how the policy rate should respond to inflation and output, waits for the recessions lesson.",
        ],
        widget: "policy-rate",
      },
    ],
    predictions: [
      { q: "The reserve ratio is 20 percent and there is no cash drain. A bank receives a new deposit of 1,000. In the end, deposits can rise by about…", options: ["5,000", "1,200", "200"], answer: 0, why: "The multiplier is 1 ÷ 0.2 = 5, so 1,000 of new reserves supports about 5,000 of deposits." },
      { q: "Households start using a phone payment system that makes it easier to pay without holding cash. What happens to LM?", options: ["It moves right", "It moves left", "It does not move"], answer: 0, why: "Money demand falls at each Y and r, so the rate that clears the market falls and LM moves right." },
      { q: "The price level rises 10 percent and the nominal money supply is unchanged. What happens to LM?", options: ["It moves left", "It moves right", "It does not move, since M is unchanged"], answer: 0, why: "Real balances M/P fall, so the interest rate that clears the market is higher at each Y." },
      { q: "People start to expect higher inflation, with everything else unchanged. What happens to LM, in terms of the real rate?", options: ["It moves right", "It moves left", "It does not move"], answer: 0, why: "At the old real rate the nominal rate is higher, which lowers money demand. A lower real rate is needed to clear the market, so LM moves right." },
      { q: "The central bank announces it will raise its policy rate. In the model it has…", options: ["reduced the money supply, moving LM left", "increased the money supply, moving LM right", "shifted IS left, and not LM"], answer: 0, why: "To hold a higher short-term rate, the central bank supplies fewer reserves, which means less money. LM moves left." },
      { q: "Investors become much more worried about the safety of stocks and bonds. What happens?", options: ["Money demand rises and LM moves left", "Money demand falls and LM moves right", "Only IS is affected"], answer: 0, why: "Safe money becomes more attractive, so at each Y and r people want more of it. The clearing rate rises and LM moves left." },
    ],
    newsColumns: ["In the news", "Driver", "Curve moved", "Effect"],
    news: [
      { headline: "The central bank announces it will buy government bonds every month.", driver: "Money supply rises (open market purchase)", curve: "LM right", effect: "The interest rate that clears the money market falls at each level of output." },
      { headline: "The central bank raises its key rate by a quarter point.", driver: "Policy rate up, money supply down", curve: "LM left", effect: "Higher real rate and lower short-run output, other things equal." },
      { headline: "A survey shows families expect prices to rise faster next year.", driver: "Expected inflation rises", curve: "LM right", effect: "People hold less money, so the real rate that clears the market falls. IS and the nominal rate matter too." },
      { headline: "Stock markets tumble and investors seek safe assets.", driver: "Risk of alternatives rises", curve: "LM left", effect: "Money demand rises at each output and rate." },
      { headline: "Banks are allowed to hold a smaller share of deposits in reserve.", driver: "Reserve requirement falls", curve: "LM right (through a larger M)", effect: "The multiplier rises, so the same reserves support more money." },
      { headline: "Prices rise 8 percent over the year and the central bank leaves the money supply unchanged.", driver: "P rises", curve: "LM left", effect: "Real balances fall, pushing the interest rate up at each output." },
    ],
    cases: [
      {
        heading: "Zimbabwe's hyperinflation and the 2024 ZiG",
        text: "In the late 2000s the Reserve Bank of Zimbabwe financed government spending by creating money on a huge scale. The price level rose so fast that, by late 2008, prices were roughly doubling every day or so by some estimates, and notes of enormous face value circulated. In the model's terms, a vast rise in M leads to a matching rise in P, so real balances M/P do not rise at all. Money lost its use as a store of value and a unit of account, and people turned to foreign currencies. The country dropped its own currency in 2009 in favour of the US dollar and others. Later attempts to reintroduce a domestic currency lost value repeatedly. In 2024 the central bank launched a new unit, the Zimbabwe Gold, or ZiG, partly backed by gold and foreign exchange reserves. Its early record is a test of whether backing can restore trust in a currency, and the result is open.",
        approx: "From memory and approximate: the date and the doubling time at the peak of the hyperinflation (estimates differ widely, and official statistics stopped), the timing of dollarisation, the launch of the ZiG in 2024, its backing, and its exchange-rate record afterwards. Check against the Reserve Bank of Zimbabwe and IMF documents.",
      },
      {
        heading: "Turkey cuts rates into high inflation",
        text: "In late 2021 Turkey's central bank lowered its policy rate by several points, while inflation was already high and rising. The model gives a clear reading. A rate cut is a larger money supply, so LM moves right, which pushes the real interest rate down. With inflation high and expected to stay high, the real rate fell sharply, and the lira fell in value against the dollar. Inflation went on to reach levels around or above 80 percent in 2022, according to official figures. The central bank later reversed course and raised its policy rate to very high levels in 2023 and 2024.",
        approx: "From memory and approximate: the size and dates of the rate cuts (a few points in autumn and winter 2021), the peak of annual inflation in 2022, and the later policy rate. Official and independent inflation estimates differed, so check against Central Bank of the Republic of Turkey releases.",
      },
      {
        heading: "El Salvador and bitcoin as a payment technology",
        text: "El Salvador already used the US dollar as its currency. In 2021 it made bitcoin legal tender alongside the dollar, and the government launched a digital wallet. If a cheap new way of paying were widely adopted, the model's payment-technology term would apply: people would need to hold less of the old form of money, and LM would shift right. In practice, surveys found that very few people used bitcoin for ordinary purchases, and in the following years the government rolled back the requirement that businesses accept it. The case shows that a payment technology only shifts LM if people actually adopt it.",
        approx: "From memory and approximate: the date of the law (September 2021), the low use reported in surveys, and the later change to voluntary acceptance under an IMF programme. Check against the IMF and Salvadoran central bank documents.",
      },
      {
        heading: "The Fed's balance sheet",
        text: "Before the 2008 crisis the US Federal Reserve held assets worth under a trillion dollars. During and after the crisis, and again in 2020, it bought large quantities of government and mortgage-backed bonds, paying with newly created reserves, and its balance sheet grew to several trillion dollars, a peak of roughly nine trillion in 2022. These purchases are open market operations on a very large scale. From 2022 the Fed let bonds mature without replacing them, which shrinks reserves, a move in the opposite direction.",
        approx: "From memory and approximate: the size of the balance sheet before 2008 (under 1 trillion dollars), at its 2022 peak (about 9 trillion), and its later fall. Check against the Federal Reserve's H.4.1 releases.",
      },
    ],
  },
  {
    n: 6, slug: "is-lm-fe", part: 2, title: "The IS-LM-FE model",
    summary: "Put the goods, money and labour markets on one picture, and learn the single procedure that answers every shock question.",
    covers: ["The three curves and what each intersection means", "Slack, scarcity and why prices move", "The eight-step recipe", "Money neutrality and the speed of price adjustment"],
    body: [
      "The model is three conditions drawn against output on the horizontal axis and the real interest rate on the vertical. Each one describes a market. Together they give the one procedure this course uses for every question about a shock: move the curve that the shock moves, find where the economy lands while prices are stuck, then ask whether prices have a reason to move.",
      "This lesson builds that procedure. It starts with what the curves mean, shows how a change in the price level shifts LM, then plays the recipe on two shocks and finishes with a sandbox where you pick the shock yourself. All numbers are index units from a toy economy (output of 100, a real interest rate of 5 percent, a price level of 1), meant to get directions and sizes in proportion, not to describe any country.",
    ],
    takeaways: [
      "IS and LM cross where the goods market and the money market both clear at the current price level. FE is the output the labour market supports. Only where all three meet is the economy at rest.",
      "Left of FE there is slack and prices are expected to fall; right of FE there is scarcity and prices are expected to rise.",
      "A higher price level shrinks real money M/P, so LM shifts left, the real interest rate rises and bond prices fall. A lower price level does the opposite.",
      "Every shock question has the same shape: which curve moves, where do IS and LM cross at the old price level, how does that compare with FE, then let prices move.",
      "Money is neutral when prices adjust at once, and not neutral while they are slow: the slower the prices, the longer a money change moves output.",
    ],
    sections: [
      {
        heading: "Three curves, three markets",
        paras: [
          "The IS curve is the set of output and interest rate pairs at which desired saving equals desired investment. Lower interest rates raise investment and, through lower saving, shift spending toward today, so more output is demanded: IS slopes down. It holds fixed everything that moves saving or investment at a given rate, such as taxes, government purchases, wealth and expected returns on capital.",
          "The LM curve is the set of pairs at which the real money supply M/P equals real money demand. Higher output means more transactions and so more demand for money; with the supply fixed, the interest rate has to rise to hold demand back. LM slopes up. It holds fixed the nominal money supply, the price level, expected inflation and the other things that shift money demand.",
          "The FE line is vertical at full-employment output. It is where the labour market clears and the economy produces all it can at normal intensity. It moves only when productivity, capital, labour supply or taxes on labour change.",
          "Where IS and LM cross, the goods and money markets clear. That is the short-run equilibrium, and it can be left or right of FE. Where all three cross, the labour market also clears, nothing pushes prices, and the economy is at rest. That is general equilibrium, which the course treats as the long run.",
        ],
      },
      {
        heading: "Slack, scarcity and the pull on prices",
        paras: [
          "If the IS-LM point lies left of FE, the economy is producing less than it can. Employment is below its full level, factories are under-used, and sellers compete harder for buyers. Prices are expected to fall. If the point lies right of FE, demand is running past normal capacity. Firms compete to hire and to buy inputs, and prices are expected to rise.",
          "Either way the price change does something specific: it changes real money balances M/P, and that moves LM. The next figure lets you see this. Set government spending to shift IS, then move the price level and watch the point slide along IS.",
        ],
      },
      {
        heading: "How a price change moves LM",
        paras: [
          "Take the nominal money supply as fixed. If prices fall, the same dollars buy more, so real money balances rise. People now hold more money than they want at the old interest rate. They use the extra to buy bonds, which bids bond prices up and so pushes the interest rate down. At every output the rate that clears the money market is now lower, which is a shift of LM to the right.",
          "If prices rise, real balances shrink. People are short of money, they sell bonds to get it, bond prices fall and the interest rate rises at every output. LM shifts left. Bond prices and interest rates always move in opposite directions: a bond that pays a fixed amount later is worth less today when the rate used to discount it is higher.",
          "That is why slack pulls LM right, lowering the interest rate and raising output until the point reaches FE, and scarcity pulls LM left until it does.",
        ],
        widget: "price-lm",
      },
      {
        heading: "The recipe, played twice",
        paras: [
          "The recipe has eight steps. 1) Start at the resting point A, with all three curves crossing. 2) Name the shock and the market it hits. 3) Move the curve that shock moves, and only that curve. 4) Find the short-run point B, where IS and LM cross at the old price level. 5) Check the side markets at B: saving and investment, money, and labour. 6) Compare output at B with FE. 7) Let prices adjust, which moves LM. 8) Land at the long-run point C and compare it with A.",
          "The price step is never skipped. A common mistake is to stop at B. Point B is only the answer for a short period, and it is a different answer from C whenever B is not on FE.",
          "Try it on the two shocks below. Predict first, then step through. The money supply shock moves LM and, in the long run, only the price level changes. The government spending shock moves IS: output rises at first, but in the long run the extra spending crowds out investment through a higher interest rate, and prices end up higher.",
        ],
        widget: "recipe-two",
      },
      {
        heading: "Money neutrality and how fast prices adjust",
        paras: [
          "Run the money supply shock again, now with the speed of price adjustment under your control. If prices adjust at once, an increase in the money supply raises the price level in the same proportion and nothing else moves: output, the real interest rate, employment and the real wage stay where they were. That is money neutrality, the classical result.",
          "If prices adjust slowly, the extra money lowers the interest rate and raises output above FE for a while, until rising prices shrink real balances back to their old level. The slower the adjustment, the longer the boost lasts, which is the Keynesian result. The long run is the same in both cases. The disagreement is about how long the short run is.",
        ],
        widget: "money-neutrality",
      },
      {
        heading: "A puzzle about money demand",
        paras: [
          "Money demand rises with output and falls with the interest rate. Yet along an LM curve both output and the interest rate change, while the quantity of money held stays at M/P. Is that a contradiction?",
          "No. As you move up LM, higher income raises money demand and the higher rate lowers it, and the two effects cancel exactly. That is what makes the point a point on LM. Only a change in something else, such as the price level, the nominal money supply or expected inflation, breaks the cancellation and shifts the curve.",
        ],
        widget: "lm-puzzle",
      },
      {
        heading: "Your turn",
        paras: [
          "Here is the full set of shifters from the shift table. Pick any, predict where the economy goes at B and at C, then run the recipe and compare. A wrong prediction is the quickest way to find which step of the recipe you are skipping.",
        ],
        widget: "ge-sandbox",
      },
    ],
    predictions: [
      { q: "The IS-LM point lies to the left of FE. What do you expect to happen next?", options: ["Prices fall, real money rises, LM shifts right", "Prices rise, real money falls, LM shifts left", "Nothing: the economy stays there"], answer: 0, why: "Left of FE is slack. Slack pushes prices down, which raises M/P and moves LM right, lowering the interest rate and raising output toward FE." },
      { q: "The price level rises and the nominal money supply does not change. What happens to the real interest rate and to the price of bonds?", options: ["The rate falls and bond prices rise", "The rate rises and bond prices fall", "The rate rises and bond prices rise"], answer: 1, why: "Real money M/P shrinks, people sell bonds to get money, bond prices fall and so the interest rate rises. Interest rates and bond prices always move in opposite directions." },
      { q: "The money supply rises 10 percent and prices adjust at once. In the long run which of these differ from before?", options: ["Only the price level, which is 10 percent higher", "Output and the price level", "The real interest rate and the price level"], answer: 0, why: "With instant adjustment, the price level rises by the same share as the money supply, real balances return to their old level, and nothing real changes." },
      { q: "Government spending rises with the money supply unchanged. Compared with the start, what is true in the long run?", options: ["Output is higher and the interest rate is unchanged", "Output is unchanged, the real interest rate is higher and the price level is higher", "Output, the interest rate and the price level are all unchanged"], answer: 1, why: "In the long run output is back on FE. The extra spending is paid for by less investment, which needs a higher interest rate, and a rise in the price level shrinks real money to make that happen." },
      { q: "A student answers a shock question by stopping at point B. Which step has been skipped?", options: ["Naming the shock", "Letting prices adjust to the long-run point", "Finding where IS and LM cross"], answer: 1, why: "The price step is never skipped. Point B holds only while prices are stuck. Unless B is on FE, prices will move and take the economy to C." },
      { q: "Moving along the LM curve to a higher output, what happens to the quantity of money people want to hold?", options: ["It rises with income", "It falls with the higher rate", "It does not change: the two effects cancel"], answer: 2, why: "Along LM, money demand equals the fixed real supply. Higher income raises demand and the higher interest rate lowers it by the same amount." },
    ],
    newsColumns: ["In the news", "Driver", "Curve moved", "Effect before prices adjust"],
    news: [
      { headline: "Bank branches report that customers are keeping fewer cash balances after a new payment app spread.", driver: "Payment technology improves", curve: "LM right", effect: "Money demand falls, the interest rate falls and output rises above FE; prices then rise and pull LM back." },
      { headline: "The government announces a three-year programme of school building paid from the budget.", driver: "Government spending rises", curve: "IS right", effect: "Output and the interest rate rise at B; prices rise and crowd out investment until output is back on FE." },
      { headline: "Retail prices have fallen for six months while factories sit half empty.", driver: "Slack: output left of FE", curve: "LM right (via falling P)", effect: "Falling prices raise real money, lower the interest rate and slowly raise output." },
      { headline: "Parliament is told that the central bank will hold the money supply steady for the rest of the year.", driver: "No shifter", curve: "None", effect: "With nothing to move, the recipe ends at once: nothing happens at B or C." },
    ],
  },
  {
    n: 7, slug: "supply-shocks", part: 2, title: "Supply shocks and stagflation",
    summary: "Why an oil shock lowers output and raises prices at once, and why policy has no good answer to it.",
    covers: ["A fall in A moves FE left", "Policy after a supply shock", "Combined supply and demand shocks", "The 1970s, 2021-22 and the 1990s productivity boom"],
    body: [
      "A supply shock changes how much the economy can produce. It moves the FE line, not IS or LM. That single fact explains why supply shocks behave so differently from demand shocks: output and prices move in opposite directions, and the central bank cannot repair both.",
      "In this lesson an oil price rise stands in for a fall in total factor productivity A, because dearer energy means less output from the same workers and machines. It is a stand-in, not a measurement: real oil shocks also hit demand and the terms of trade. All model numbers are index units from a toy economy.",
    ],
    takeaways: [
      "A fall in A shifts FE left, lowers labour demand, and lowers the real wage and full-employment employment. IS and LM do not move, so the economy first stays where it was.",
      "Output at that point is now above FE, which is scarcity: prices rise, real money shrinks, LM moves left, and the economy settles at lower output, a higher price level and a slightly higher real interest rate. That mix is stagflation.",
      "A favourable supply shock (a productivity boom, more capital, cheaper energy) is the mirror image: FE moves right, there is slack, prices fall and output rises.",
      "Policy cannot lift output above FE for long. Easing money only raises prices once they adjust; tightening gets inflation down sooner but costs output now, and if large enough pushes output below the new FE.",
      "When a shock hits supply and demand together, output falls for certain but the price level can go either way, depending on which effect is larger.",
    ],
    sections: [
      {
        heading: "A fall in A moves FE",
        paras: [
          "Output comes from labour and capital through the production function, Y = A K^a N^(1-a). A fall in A lowers the marginal product of labour at every level of employment. Labour demand, which is the marginal product of labour, shifts down. Firms will pay a lower real wage for the same number of workers, so the market-clearing real wage falls, fewer people choose to work, and full-employment employment drops.",
          "Less employment and lower productivity give a lower full-employment output. The vertical FE line moves left. Nothing in saving, investment or money demand has changed, so IS and LM have not moved.",
        ],
      },
      {
        heading: "Sitting still, then sliding left",
        paras: [
          "Because IS and LM have not moved, the short-run point B is the same as the old point A: output has not changed yet and neither has the interest rate. But the FE line has moved to the left, so that point now lies to the right of FE. Output is above what the economy can sustain, and there is scarcity.",
          "Scarcity pushes prices up. A higher price level lowers real money balances, which shifts LM left, so the interest rate rises and output falls along IS until the point reaches the new FE. At C output is lower, the price level is higher, employment and the real wage are lower, and the real interest rate is a little higher. Play it below, then try the other three supply shocks.",
          "Stagflation is the word for falling output together with rising prices. Reading the signs backward helps: if output falls and prices rise, the shock is more likely to have moved FE left than to have moved IS or LM left, since those two make prices fall.",
        ],
        widget: "oil-lab",
      },
      {
        heading: "The reverse, a boom in productivity or capital",
        paras: [
          "Run the same steps with a rise in A, or a rise in the capital stock that raises the marginal product of capital and with it output per worker. FE moves right, and IS and LM stay put, so the old point is now left of FE: slack. Prices fall, real money rises, LM shifts right, the interest rate falls and output rises until the point reaches the new FE.",
          "A technology that makes energy much cheaper, such as the shale oil and gas boom, works like a rise in A for economies that use a lot of energy. It lowers prices and raises capacity at the same time, which is an unusually pleasant combination. In the toy economy a rise in the capital stock stands in for a rise in the marginal product of capital; the model does not draw a separate line for it.",
        ],
      },
      {
        heading: "Policy has no good answer",
        paras: [
          "After a demand slump a central bank can aim at the old output level. After an adverse supply shock it cannot, because the old output level is no longer sustainable: it lies to the right of the new FE. Anything that holds output above FE leaves scarcity in place and keeps prices rising.",
          "So the choice is between two bad paths. Easing the money supply holds output up for a while, but as prices adjust the whole gain turns into a higher price level, and output still ends at the lower FE. Tightening brings the price level down sooner, but output falls immediately, and if the tightening is large it takes output below the new FE, a deeper slump than the shock caused on its own. Move the slider across zero and watch the two paths.",
        ],
        widget: "policy-dilemma",
      },
      {
        heading: "Combined shocks",
        paras: [
          "Real events rarely move just one curve. A hurricane destroys capital, which is a supply loss, and it also wipes out household wealth and interrupts spending, which are demand losses. The supply loss moves FE left and tends to raise prices; the demand loss moves IS left and LM right, and tends to lower them.",
          "Output falls in the long run whatever the mix, because capacity is lost. But whether the price level ends higher or lower depends on which effect is larger. That is why a headline about prices alone is a weak guide to which curve moved: check output and the labour market too.",
        ],
        widget: "hurricane",
      },
      {
        heading: "The 1970s as a test",
        paras: [
          "In the 1970s US inflation and unemployment rose together, which a pure demand story struggles to explain, and a leftward FE shift predicts. The chart shows approximate annual values. Oil was not the only cause, and policy was also loose in the early part of the decade, so the figures should be read as consistent with the model, not as a clean experiment.",
        ],
        widget: "us-1970s",
      },
    ],
    predictions: [
      { q: "An oil price rise lowers productivity A. Right after the shock, before prices move, where is the economy?", options: ["At a point left of the old FE, with output already fallen", "At the same IS-LM point as before, now right of the new FE", "At a lower IS-LM point, because IS has moved left"], answer: 1, why: "A supply shock moves FE, not IS or LM. The IS-LM point is unchanged and is now above the lower FE, which creates scarcity." },
      { q: "After the prices have fully adjusted, compared with the start, an adverse supply shock leaves output and the price level…", options: ["Output lower, price level higher", "Output lower, price level lower", "Output unchanged, price level higher"], answer: 0, why: "FE has moved left, so output ends lower. Scarcity raises prices on the way, so the price level ends higher: stagflation." },
      { q: "After an adverse supply shock the central bank raises the money supply to hold output up. In the long run, what is different from doing nothing?", options: ["Output is higher", "The price level is higher, with the same output", "The real interest rate is lower and output is higher"], answer: 1, why: "In the long run output is on FE whatever the money supply does. More money only raises the price level." },
      { q: "A productivity boom shifts FE right. Which of these follows?", options: ["Slack, then falling prices and rising output", "Scarcity, then rising prices", "No change, because IS and LM did not move"], answer: 0, why: "The old point is left of the new FE, which is slack. Prices fall, LM moves right, output rises to the new FE." },
      { q: "A hurricane destroys capital and also cuts demand. What can you say for sure about the long run?", options: ["Output is lower", "The price level is higher", "The price level is lower"], answer: 0, why: "Lost capital lowers capacity. The price level depends on whether the supply or the demand effect is larger." },
      { q: "Output falls and prices rise together. Which curve most likely moved?", options: ["IS to the left", "LM to the left", "FE to the left"], answer: 2, why: "A fall in IS or LM lowers prices in the long run. Only a fall in FE gives falling output together with rising prices." },
    ],
    newsColumns: ["In the news", "Driver", "Curve moved", "Effect"],
    news: [
      { headline: "A shipping lane closes and fuel costs jump, forcing factories to cut shifts.", driver: "Energy costs rise, A falls", curve: "FE left", effect: "Output falls, prices rise, real wages fall." },
      { headline: "A new extraction technique makes domestic gas much cheaper and factories expand.", driver: "Energy costs fall, A rises", curve: "FE right", effect: "Output rises, prices fall, real wages rise." },
      { headline: "Storm destroys ports and warehouses, and shoppers hold back spending.", driver: "Capital lost and wealth lost", curve: "FE left, IS left", effect: "Output falls; the price effect depends on which is larger." },
      { headline: "Central bank cuts rates to cushion a fuel-price jump; analysts warn of faster inflation later.", driver: "Easing after a supply shock", curve: "LM right", effect: "Output held up for a while; the long-run result is a higher price level." },
    ],
    cases: [
      {
        heading: "The 1973 and 1979 oil shocks",
        text: "Oil prices rose several-fold in 1973 and 1974, after an embargo during the Arab-Israeli war of October 1973, and roughly doubled again around 1979 after the Iranian revolution. In the United States inflation climbed to around 11 percent in 1974 and again to over 13 percent in 1980, while unemployment rose to near 9 percent in the mid-1970s and near 10 percent in 1982. Output fell in 1974 and 1975. Monetary policy and price controls also played a part, so the data fit the model but are not a clean test of it.",
        approx: "From memory and approximate: the size of the oil price rises, the inflation and unemployment rates and the dates. Check against BLS and BEA series.",
      },
      {
        heading: "The 2021 and 2022 supply squeeze",
        text: "As economies reopened after COVID, shipping delays and a shortage of microchips held back supply, and energy prices rose sharply again after Russia invaded Ukraine in early 2022. Inflation in the United States reached roughly 9 percent over twelve months in mid-2022, and in much of Europe it reached about 10 percent late that year. Unemployment stayed low in the US, which shows that demand was also strong, so it is a mixed case and not a pure stagflation.",
        approx: "From memory and approximate: the inflation peaks, the timing and the unemployment level. Check against official releases.",
      },
      {
        heading: "The 1990s productivity boom",
        text: "US output per hour grew by about 1.5 percent a year from the early 1970s to the mid-1990s and by roughly 2.5 percent a year in the late 1990s and early 2000s, a pickup usually tied to computers and networks. Unemployment fell to about 4 percent around 2000 while inflation stayed around 2 to 3 percent, as a rightward FE shift predicts.",
        approx: "From memory and approximate: both productivity growth rates and the unemployment and inflation levels. Check against BLS productivity data.",
      },
      {
        heading: "Shale oil in the 2010s",
        text: "US crude oil production roughly doubled between 2008 and 2015, from about 5 million to about 9 million barrels a day, as fracking spread. World oil prices fell by more than half between 2014 and early 2016. For oil-importing economies that was a positive supply shock; for oil-producing ones it was a negative one.",
        approx: "From memory and approximate: production levels and the size and dates of the price fall. Check against US Energy Information Administration data.",
      },
    ],
  },
  {
    n: 8, slug: "demand-shocks", part: 2, title: "Demand shocks and sticky prices",
    summary: "How a fall in confidence or wealth causes a recession, why it can last, and when stimulus helps.",
    covers: ["Demand shocks through IS and through LM", "Why prices and wages stick", "Fiscal stimulus and the multiplier", "The liquidity trap"],
    lab: { regime: "closed", shocks: ["wealth-down", "future-income-down", "taxes-up", "expected-inflation-down", "money-supply-down"], defaultShock: "wealth-down" },
  },
  {
    n: 9, slug: "recessions", part: 2, title: "Recessions",
    summary: "What puts output below capacity, how long it lasts, and what policy can do.",
    covers: ["Slumps from falling demand", "Slumps from falling capacity", "Policy responses and their limits"],
    lab: { regime: "closed", shocks: ["taxes-up", "wealth-up", "money-supply-up", "gov-spending-up"], defaultShock: "taxes-up" },
  },
  {
    n: 10, slug: "exchange-rates", part: 3, title: "Exchange rates",
    summary: "Nominal and real exchange rates, and what moves them under floating and fixed regimes.",
    covers: ["e and the real exchange rate", "Interest parity and expected currency moves", "Floating regimes against pegs"],
    body: [
      "A trade deficit, a cheap holiday abroad and a falling stock market in Tokyo can all trace back to one price: the price of one currency in terms of another. This lesson gives that price two forms. The nominal exchange rate says how many units of foreign money one unit of home money buys. The real exchange rate says how many foreign goods one home good buys. Trade follows the second; headlines report the first.",
      "Throughout, e is the number of units of foreign currency per one unit of home currency, so a rise in e means the home currency has appreciated and a fall means it has depreciated. The real exchange rate is RER = e × P_home ÷ P_foreign, where each P is a price level in its own currency. Everything below keeps those two definitions fixed.",
      "All model numbers are index units from a toy economy, not data. Real-world figures are from memory, approximate, and kept in separate boxes.",
    ],
    takeaways: [
      "A rise in e is an appreciation of the home currency. With prices unchanged it makes home goods dearer abroad and foreign goods cheaper at home, so net exports fall.",
      "RER = e × P_home ÷ P_foreign. A high RER means home goods are expensive relative to foreign goods; net exports fall as it rises.",
      "Regimes run on a spectrum. The more tightly a country fixes its rate, the less room its central bank has for its own interest rate policy.",
      "Uncovered interest parity: e₁ = e₀(1 + r_foreign) ÷ (1 + r_home). Money moves until the expected change in e cancels the gap in interest rates, so a higher rate is paired with an expected depreciation.",
      "A carry trade earns the rate gap in calm times and loses when the funding currency jumps. Leverage multiplies both outcomes.",
    ],
    sections: [
      {
        heading: "What a strong currency does",
        paras: [
          "Suppose the dollar appreciates by 10 percent against the euro while prices in both places stay put. A car priced at the same number of dollars now costs a European buyer about 10 percent more euros. A bottle of wine priced at the same number of euros now costs an American buyer about 9 percent fewer dollars, because 1 ÷ 1.10 is about 0.91. Our goods got dearer to foreigners and theirs got cheaper to us.",
          "So buyers on both sides lean toward foreign goods: our exports fall, our imports rise, and net exports NX fall. This is why the real exchange rate matters for the IS curve. In the model, NX sits inside IS and falls as the RER rises.",
        ],
        widget: "strong-currency",
      },
      {
        heading: "Nominal against real, with a hamburger",
        paras: [
          "If prices are fixed, RER moves one for one with e. But prices are not fixed, and a currency can look strong in nominal terms while the country's prices have risen even faster. The real rate corrects for both.",
          "One way to see the idea is to price a single standard good in two places. A widely sold burger is nearly the same everywhere, so the dollar price of the burger abroad, divided by its dollar price in the US, is a one-good RER. Above 1 means the foreign currency buys less burger than the dollar does, so that currency looks overvalued. Below 1 means it looks undervalued.",
          "Read this as a rough gauge, not a forecast. A burger is partly local labour and rent, which are cheap in poorer countries, so such places tend to look undervalued even when nothing is wrong.",
        ],
        widget: "big-mac",
      },
      {
        heading: "Regimes on a spectrum",
        paras: [
          "A country picks how much freedom to give its exchange rate. At one end the rate floats and the central bank sets interest rates for domestic goals. At the other, the country uses another country's money, so its rate cannot move at all and it has given up monetary policy entirely. In between sit bands, crawling bands, and currency boards that tie the money supply to reserves.",
          "The trade-off is general. A fixed rate gives stable trade prices and an anchor against inflation. It costs the central bank its own interest rate: to hold the rate, the bank must move rates and the money supply with the anchor country's. Click through the regimes to see what each demands.",
        ],
        widget: "regime-spectrum",
      },
      {
        heading: "Why money chases interest rates",
        paras: [
          "Investors compare a deposit at home with a deposit abroad. The foreign one pays its own rate, but the investor's return in home money also depends on how e moves while the money is away. If e is expected to fall, a foreign deposit's earnings buy less home money when converted back.",
          "Setting the two returns equal gives uncovered interest parity: e₁ = e₀(1 + r_foreign) ÷ (1 + r_home). With r_home above r_foreign, the right-hand side is below e₀, so e is expected to fall: the high-interest currency is expected to depreciate. If the expected move is smaller than that, money flows toward the high rate, which pushes e up today and lowers the move still to come, until parity holds.",
          "This is the link between the interest rate and the exchange rate in the model: raise the home rate and the currency appreciates now, with a depreciation expected afterwards.",
        ],
        widget: "uip",
      },
      {
        heading: "The carry trade",
        paras: [
          "Parity is a statement about expectations. In practice many investors bet that e will not move as much as the rate gap implies. A carry trade borrows in a low-rate currency, converts the money, and lends it in a high-rate one. It pays the rate gap each year as long as the funding currency does not appreciate by more than the parity amount.",
          "That makes the payoffs lopsided. Small, steady gains are collected when nothing happens. When a funding currency rises sharply, many investors rush to repay their loans at once, which buys the funding currency and pushes it up further. Borrowed money multiplies the loss. Try the widget at a 5× position and move the funding currency by 14 percent.",
        ],
        widget: "carry",
      },
      {
        heading: "On the curves",
        paras: [
          "In the lab below the economy floats and capital is partly mobile. A rise in the money supply pushes the home interest rate down, so capital leaves, e falls, and the lower RER raises NX; that adds to the expansion. A rate rise abroad also pulls capital out, so e falls and NX rise. Fiscal expansion does the reverse: it raises the home rate, capital comes in, e rises and NX fall, which offsets part of the stimulus. Predict the direction of Y, r, P, C, I, N, w, e and NX before you reveal.",
        ],
      },
    ],
    lab: { regime: "floating", mobility: 0.5, shocks: ["money-supply-up", "gov-spending-up", "foreign-rate-up"], defaultShock: "money-supply-up" },
    cases: [
      {
        heading: "Reading a burger table",
        text: "The Economist magazine has published a burger-based exchange-rate table since the mid-1980s. In recent editions, Switzerland has usually sat at the overvalued end, with the burger costing noticeably more in dollars than in the US, while China, India and Japan have sat at the undervalued end. The calculator above works the same way with its own rounded inputs.",
        approx: "From memory and approximate: the direction of the gaps for these countries, and the rounded prices and rates in the calculator (early 2024). Take current values from the published table and overwrite the inputs. Not checked against any course material.",
      },
      {
        heading: "The yen carry unwind of August 2024",
        text: "For years the Bank of Japan kept rates near zero while US rates were far higher, and investors borrowed yen to hold dollar assets. On 31 July 2024 the Bank of Japan raised its rate to about a quarter of a percent, and US data pointed toward rate cuts. Within days the yen rose sharply, and on 5 August Japanese shares fell by around 12 percent in a day, among the largest one-day drops on record. The moves partly reversed within weeks.",
        approx: "From memory and approximate: the yen's rise from about 162 to about 142 per dollar between early July and early August 2024, the rate near 0.25 percent, and the size of the 5 August fall in Japanese shares. Check against Bank of Japan and exchange data.",
      },
    ],
    newsColumns: ["In the news", "Driver", "Curve moved", "Effect"],
    news: [
      { headline: "Overseas buyers are choosing local rivals as the dollar hits a multi-year high.", driver: "A higher e makes our goods dearer abroad", curve: "IS shifts left through lower NX", effect: "Net exports fall; with a floating rate, output is lower in the short run." },
      { headline: "The central bank raises its policy rate while rates elsewhere hold steady.", driver: "Home rate rises above the foreign rate", curve: "LM shifts left", effect: "Capital flows in, e rises now and is expected to fall afterwards." },
      { headline: "Traders unwind borrowed-yen positions and the yen jumps.", driver: "Funding currency appreciates sharply", curve: "IS shifts through the yen's NX effect", effect: "Carry losses mount; the yen's real rate rises, hurting Japan's exports." },
      { headline: "A small country abandons its link to the dollar and its currency halves in value.", driver: "Regime change from peg to float", curve: "IS shifts right through higher NX", effect: "Imports get dearer, exports cheaper; the central bank regains control of the interest rate." },
    ],
    predictions: [
      { q: "The home currency appreciates 10 percent and no price changes. Net exports…", options: ["rise, because home money buys more", "fall, because home goods are dearer abroad", "are unchanged, since only the nominal rate moved"], answer: 1, why: "With prices fixed, RER rises with e. Home goods cost more abroad and foreign goods cost less here, so buyers switch and NX fall." },
      { q: "e is defined as euros per dollar. It goes from 0.90 to 0.95. Seen from the US, the dollar has…", options: ["appreciated", "depreciated", "gone neither way, because it is a ratio"], answer: 0, why: "A rise in e (foreign per home) means one dollar buys more euros: the dollar appreciated." },
      { q: "A snack costs 300 pesos at home and 10 dollars in the US. The market rate is 20 pesos per dollar. The peso's real exchange rate against the dollar is…", options: ["0.5, undervalued", "1.0, at parity", "1.5, overvalued"], answer: 2, why: "e = 1 ÷ 20 = 0.05 dollars per peso. RER = 0.05 × 300 ÷ 10 = 1.5. The snack costs 50 percent more in dollars at home, so the peso looks overvalued." },
      { q: "The home interest rate is 6 percent and the foreign rate is 2 percent. Uncovered interest parity says e is expected to…", options: ["rise by about 4 percent", "fall by about 4 percent", "stay the same"], answer: 1, why: "e₁ = e₀ × 1.02 ÷ 1.06, which is about 0.962 e₀. The high-rate currency is expected to depreciate by about 4 percent." },
      { q: "A country with a currency board tied to the dollar sees the US raise its rate. Its own interest rate will…", options: ["stay put, because the board is independent", "have to rise too, or reserves drain out", "fall, because its currency is protected"], answer: 1, why: "Capital leaves for the higher US return. To keep the link, the board loses reserves and the money supply shrinks, which pushes the local rate up." },
      { q: "A funding currency jumps 14 percent against the target. A carry trader who borrowed at 0.1 percent and lent at 5.3 percent has…", options: ["a loss, even though the rate gap was positive", "still a gain, because the rate gap is positive", "exactly broken even"], answer: 0, why: "Per unit borrowed the result is 1.053 ÷ 1.14 − 1.001 ≈ −0.077. The rate gap of about 5 percent is far smaller than the 14 percent move." },
    ],
  },
  {
    n: 11, slug: "open-economy", part: 3, title: "The open economy",
    summary: "Net exports inside IS, and how capital mobility changes what policy can do.",
    covers: ["Net exports and the real exchange rate", "Capital mobility from none to perfect", "Large and small economies"],
    body: [
      "Opening the economy adds a new term to the spending identity, net exports NX, and a new market that clears alongside the others: the market for foreign exchange. This lesson follows both. First the accounting, which says that a trade deficit and a capital inflow are the same fact. Then the curves, where NX shifts IS. Last, the question of who controls the money supply: under a float the central bank does; under a peg the balance of payments does.",
      "Notation as before. e is foreign currency per unit of home currency, so a rise is an appreciation. RER = e × P_home ÷ P_foreign. The model numbers are index units from a toy economy and the country cases are from memory, with every date and size marked approximate.",
    ],
    takeaways: [
      "Saving funds investment at home or abroad: I = S − NX. A trade deficit means home investment exceeds home saving, and the gap is financed by capital flowing in (foreign saving).",
      "The current account and the financial account are two sides of one ledger. With a floating rate, reserves do not move, so CA + FA = 0; under a peg the gap is the change in reserves.",
      "NX rises with partner income and with a lower real exchange rate, and shifts with trade policy. Each of these moves IS: right if NX rises, left if it falls.",
      "Under a float, shocks are partly absorbed by e; the central bank still sets the money supply. Under a peg, the central bank must defend e, so inflows add to the money supply and outflows drain it, and monetary policy cannot be used independently.",
      "A rate rise in a large economy pulls capital from others: floating currencies fall, pegged ones lose reserves and tighten.",
    ],
    sections: [
      {
        heading: "Saving, investment and the trade balance",
        paras: [
          "Spending adds up to output: Y = C + I + G + NX. Households and government spend some of Y on consumption and government purchases, and what is left is national saving S = Y − C − G. Subtract: S = I + NX, which gives I = S − NX.",
          "Read it as a funding statement. A country that invests more than it saves has NX < 0, a trade deficit, and the missing funds are foreign saving lent to it. A country that saves more than it invests has a surplus and lends the rest abroad. Set the sliders so that S is below I and look at which part of investment is funded from abroad.",
        ],
        widget: "saving-nx",
      },
      {
        heading: "One ledger, two accounts",
        paras: [
          "The balance of payments records every payment between a country and the rest of the world. The current account CA records trade in goods and services (and, in practice, income and transfers; here CA is just NX). The financial account FA records net purchases of assets: a positive FA is capital flowing in. Every payment shows up on both sides of the books, so CA + FA equals the change in the central bank's holdings of foreign currency.",
          "If the central bank does not intervene, that change is zero and FA = −CA. Whatever flows in as a trade deficit must flow in as lending. Under a peg the bank soaks up the difference with its reserves, and that is what links the balance of payments to the money supply.",
        ],
        widget: "ledger",
      },
      {
        heading: "Net exports inside IS",
        paras: [
          "In the closed economy IS was built from saving and investment. Now IS includes NX: for each interest rate and output level, desired saving must equal desired investment plus net exports. Anything that raises NX at a given Y and r raises the total demand for home output and moves IS right.",
          "Three drivers matter most. Partner income: when trading partners grow, they import more of our goods and NX rises. Trade policy: a tariff on our imports lowers them and raises NX; a tariff by our partners lowers our exports. The real exchange rate: a higher RER makes our goods dearer and NX falls. Output at home also matters: richer households import more, which is why IS slopes more steeply than in the closed economy.",
        ],
        widget: "nx-shifters",
      },
      {
        heading: "Float against peg",
        paras: [
          "Under a float, the central bank chooses the money supply and the exchange rate moves to clear the foreign-exchange market. A shock to NX or to capital flows changes e first. That takes some of the force off output, because a falling e raises NX again. The central bank can use monetary policy for domestic aims.",
          "Under a peg, the central bank promises to trade at a fixed e. If more people want the home currency, it must sell home currency and buy foreign currency, so reserves rise and the money supply rises; if people want to leave, it sells reserves and the money supply falls. The rate of interest is pulled toward the world rate whatever the bank would like. A money expansion is undone as reserves leak out, which leaves fiscal policy as the lever that works.",
          "In the lab below, switch between the two regimes and replay the same shock. Look at e, reserves and the money supply on the side panels.",
        ],
      },
      {
        heading: "When the Fed hikes",
        paras: [
          "When the US raises its interest rate, dollar assets pay more and some investors move money out of other countries. For a country with a floating rate this lowers e: the currency depreciates, raises NX, and pushes the economy toward expansion, though dollar debts become heavier. For a country with a peg it drains reserves and tightens money, and it must raise its own rate or give up the peg. This spillover is a large reason that countries with weak reserves watch the US central bank closely.",
        ],
      },
    ],
    lab: { regime: "floating", mobility: 0.5, regimes: ["floating", "fixed"], shocks: ["money-supply-up", "gov-spending-up", "foreign-rate-up", "foreign-demand-up", "devaluation-fear"], defaultShock: "money-supply-up" },
    chainsHeading: "Cases as cause chains",
    chains: [
      {
        heading: "Finland after the Soviet collapse",
        when: "1990 to 1993",
        text: "Finland sold a noticeable share of its exports to the Soviet Union, and that trade fell away as the Soviet Union broke up. The country had tied the markka to a basket of currencies, and a domestic credit boom was also ending, so the story has more than one cause. This chain isolates the trade channel.",
        links: ["Soviet demand collapses", "Exports and NX fall: IS shifts left", "Output falls below FE", "Peg: reserves drain, money tightens", "Peg given up, markka floats (1992)", "Markka depreciates", "NX recovers: IS moves back"],
        curves: "On the curves: IS left with a peg, LM also left as reserves drain; after the float, e falls and IS returns. The lab's 'foreign demand rises' shock is the mirror image: run it in both regimes and read each arrow backwards.",
        approx: "From memory and approximate: the size of the Soviet share of exports (very roughly a fifth in the late 1980s), a fall in output of about 10 percent from 1990 to 1993, unemployment rising from low single digits to the mid-teens, and the markka floating in September 1992 and losing a large part of its value. Compare against Bank of Finland and Statistics Finland data.",
      },
      {
        heading: "The dollar and the Plaza Accord",
        when: "1980 to 1987",
        text: "In the early 1980s the United States combined tight money with large budget deficits. Interest rates were high, capital flowed in, and the dollar rose strongly. Imports surged and the trade deficit widened. In September 1985, finance ministers of five rich countries met at the Plaza Hotel in New York and agreed to help the dollar fall.",
        links: ["US deficit spending and tight money", "IS right, home rate up", "Capital flows in", "Dollar appreciates (e up)", "NX falls: record trade deficit", "Plaza Accord, Sept 1985", "e falls", "NX recovers, with a lag"],
        curves: "On the curves: fiscal expansion under a float shifts IS right; e rises and NX falls, which takes back some of the output gain. The lab's 'government spending' shock in the floating regime shows it.",
        approx: "From memory and approximate: the dollar's rise of very roughly half in trade-weighted terms from 1980 to early 1985, a fall of about 40 percent against the yen and the mark by 1987, and the date of the Plaza meeting (22 September 1985). The US trade deficit kept widening for about two years after the Plaza before it narrowed.",
      },
      {
        heading: "China's peg and its money supply",
        when: "1994 to about 2014",
        text: "For about a decade China held the yuan near 8.3 per dollar. With the rate below what the market would have set, exports boomed and foreign money came in. To keep the rate, the central bank bought dollars and paid for them with newly created yuan.",
        links: ["Yuan held below the market rate", "NX and inflows rise: IS shifts right", "Central bank buys dollars", "Reserves pile up", "Base money grows: LM shifts right", "Pressure on prices"],
        curves: "On the curves: IS right, then LM right, and in the long run the price level rises because the rate cannot do the adjusting. The central bank offset part of the money growth by issuing bills and raising reserve requirements.",
        approx: "From memory and approximate: the rate near 8.28 per dollar from the mid-1990s to 2005, gradual appreciation afterward, reserves rising to roughly four trillion dollars by about 2014, and consumer-price inflation reaching about 6 percent in 2008 and 2011. Check against People's Bank of China and IMF data.",
      },
      {
        heading: "Argentina's currency board",
        when: "1991 to 2002",
        text: "Argentina fixed the peso to the dollar by law in 1991, after hyperinflation. Inflation fell quickly. But when the dollar strengthened and its neighbour Brazil let its currency fall in 1999, Argentina's goods became dear. Prices had to fall instead of the exchange rate, and a long slump followed.",
        links: ["Peso fixed 1:1 to the dollar (1991)", "Inflation falls sharply", "Dollar strengthens, Brazil devalues", "RER high: NX falls, IS left", "Output below FE, prices must fall", "Capital flight drains reserves and money", "Peg abandoned (early 2002)", "Peso falls sharply"],
        curves: "On the curves: IS left; under a peg the only adjustment is slow price deflation, and LM shifts left as reserves leave. The lab's 'devaluation fear' shock under a peg shows the drain.",
        approx: "From memory and approximate: the law's date (1991), the Brazilian devaluation (January 1999), output falling by roughly a fifth between 1998 and 2002, deposit limits in December 2001, and a fall in the peso to several per dollar by mid-2002.",
      },
      {
        heading: "Soros against the Bank of England",
        when: "September 1992",
        text: "Britain had joined the European exchange-rate system at a fixed value against the German mark. After German reunification, German rates rose, and Britain, in a recession, had to follow them. Traders judged that the rate could not be held. The full story is told in the German reunification lesson.",
        links: ["German rates high after reunification", "UK must match them in a recession", "Markets doubt the peg: a premium on sterling", "Bank sells reserves and raises its rate", "Pound leaves the system, 16 Sept 1992", "Pound falls, rates are cut"],
        curves: "On the curves: LM left to defend the peg while IS is already weak; once markets expect a devaluation, the IS curve shifts further left. The lab's 'devaluation fear' shock under a peg is this case.",
        approx: "From memory and approximate: the date (Wednesday 16 September 1992), the Bank's rate rising from 10 percent toward 12 and an announced 15 percent on the day, the pound falling roughly 15 percent against the mark in following weeks, and the often-quoted gain of about a billion dollars for one fund.",
      },
      {
        heading: "Sanctions on Russia",
        when: "2022",
        text: "After Russia's invasion of Ukraine in February 2022, other governments froze a large share of the Russian central bank's foreign reserves. That removed the tool normally used to defend a currency in a crisis. The rouble fell hard in the first days, the central bank raised its rate sharply and imposed controls on moving money out.",
        links: ["Sanctions, reserves frozen", "Capital flight; fear of collapse", "Rouble falls, e drops", "Rate raised sharply, capital controls", "Imports collapse; energy exports stay high", "NX surplus climbs", "Rouble recovers"],
        curves: "On the curves: a floating currency under a risk premium. The lab's 'devaluation fear' shock under a float: e falls, the rate rises, NX rises.",
        approx: "From memory and approximate: about half of reserves frozen, a policy rate raised from about 9.5 to 20 percent on 28 February 2022, the rouble weakening past 100 per dollar in March and recovering to roughly 55 to 60 by mid-year, and later weakening again. For the later path, fill in from public reporting (central bank data) with links.",
      },
      {
        heading: "Fed hikes and emerging markets",
        when: "2013 and 2022",
        text: "In 2013, when the US central bank hinted at slowing its bond purchases, money left many emerging markets within weeks. Again in 2022, as US rates rose quickly, many currencies fell against the dollar.",
        links: ["US rate rises", "Foreign rate up: capital leaves", "Float: currency falls", "Peg: reserves drain", "Local central bank raises its rate", "Dollar debts weigh more"],
        curves: "On the curves: the lab's 'foreign interest rate' shock, in both regimes. Under a float e falls and NX rise; under a peg reserves leave and output falls.",
        approx: "From memory and approximate: the 2013 episode (often called the taper tantrum, May to September 2013) and the fast US rate rises that began in March 2022. Size of currency falls differs widely by country; check country data.",
      },
    ],
    newsColumns: ["In the news", "Driver", "Curve moved", "Effect"],
    news: [
      { headline: "Major trading partners report a pickup in growth and imports.", driver: "Partner income rises", curve: "IS shifts right (NX up)", effect: "Output and the rate rise; with a float the currency also strengthens." },
      { headline: "The central bank drains reserves for the third week to hold the exchange rate.", driver: "Outflow under a peg", curve: "LM shifts left", effect: "The money supply shrinks, the interest rate rises, output falls." },
      { headline: "Country's trade deficit widens as foreign investors pour money into its bonds.", driver: "Capital inflow", curve: "IS shifts left through lower NX", effect: "Two sides of one ledger: the inflow and deficit match." },
      { headline: "A rate rise in the US sends emerging currencies lower.", driver: "Foreign rate up", curve: "IS shifts right under a float, left under a peg", effect: "Floating currencies depreciate and NX rise; pegged central banks lose reserves." },
    ],
    predictions: [
      { q: "A country saves 18 and invests 22. Net exports are…", options: ["+4, a surplus", "−4, a deficit financed by foreign saving", "0, since saving equals investment in the long run"], answer: 1, why: "NX = S − I = 18 − 22 = −4. The shortfall in saving is made up by capital flowing in." },
      { q: "Under a peg, CA = −6 and private capital inflow FA = +4. The central bank…", options: ["buys 2 of reserves", "sells 2 of reserves, draining money", "does nothing; the ledger already balances"], answer: 1, why: "CA + FA = −2, so reserves fall by 2 and the money supply with them." },
      { q: "A trading partner's income jumps. At home, IS…", options: ["shifts right, because NX rise", "shifts left, because imports rise", "does not move"], answer: 0, why: "Partners with higher incomes buy more of our goods, so NX rise at every Y and r." },
      { q: "A pegged-currency central bank cuts interest rates by expanding credit. The result is that…", options: ["output rises a lot, as in a closed economy", "reserves leak out and output barely moves", "the currency depreciates"], answer: 1, why: "Lower rates draw capital out; to keep the rate fixed the bank sells reserves, which cancels the extra money." },
      { q: "The Fed raises rates. A country with a floating currency sees…", options: ["its currency fall and net exports rise", "its currency rise and net exports fall", "reserves fall"], answer: 0, why: "Capital leaves for the higher dollar return, so e falls. A lower RER raises NX." },
      { q: "A pegged economy's main trading partner puts a tariff on its goods. Compared with a floating economy…", options: ["the loss of output is larger, since e cannot fall", "the loss of output is smaller, since reserves help", "nothing differs"], answer: 0, why: "A float lets e fall and cushions NX. A peg cannot, so output carries the hit and reserves drain." },
    ],
  },
  {
    n: 12, slug: "tariffs-trade", part: 3, title: "Tariffs and trade",
    summary: "What tariffs do to net exports, the exchange rate and output.",
    covers: ["Tariffs and net exports", "Retaliation and a partner's tariff", "Why a float can offset a tariff"],
    lab: { regime: "floating", mobility: 0.5, shocks: ["tariff-up", "partner-tariff-up"], defaultShock: "tariff-up" },
  },
  {
    n: 13, slug: "reunification-capital-flows", part: 3, title: "Reunification and capital flows",
    summary: "Large shifts in saving and investment across borders, and what pegs and reserves do under strain.",
    covers: ["Shocks that move capital across borders", "Pegs, reserves and speculative attacks", "Linked economies"],
    lab: { regime: "fixed", mobility: 0.5, shocks: ["devaluation-fear", "peg-undervalued", "foreign-rate-up"], defaultShock: "devaluation-fear" },
  },
  {
    n: 0, slug: "practice", part: 4, kind: "practice", title: "Practice",
    summary: "Mixed problems across all parts, with the shocks to try and the answers to check against.",
    covers: ["Predict-then-check drills", "Reading a news item as a shock", "Putting the whole recipe together"],
  },
];

export const lessonBySlug = (slug: string) => lessons.find((l) => l.slug === slug);

/** Old lesson addresses and where they live now. */
export const legacySlugs: Record<string, string> = {
  islm: "is-lm-fe",
  productivity: "productivity-growth",
  "labor-market": "unemployment",
  fx: "exchange-rates",
  "full-employment": "is-lm-fe",
  "goods-market-is": "saving-investment",
  "money-market-lm": "money-inflation",
  "labor-productivity": "productivity-growth",
  recipe: "is-lm-fe",
  "supply-demand-shocks": "supply-shocks",
  "price-adjustment": "is-lm-fe",
  "fiscal-policy": "demand-shocks",
  "monetary-policy": "demand-shocks",
  "policy-tradeoffs": "recessions",
  "floating-rates": "exchange-rates",
  "fixed-rates": "exchange-rates",
};
