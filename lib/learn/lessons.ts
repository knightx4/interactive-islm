import type { Regime } from "@/lib/macro/model";

/** A playable lab on a lesson page: which economy, which shocks, which one starts selected. */
export type LabSpec = {
  regime: Regime;
  /** Capital mobility for open economies, 0 (none) to 1 (perfect). */
  mobility?: number;
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
};

export const parts = [
  { n: 1, title: "The building blocks", blurb: "How to measure an economy, and what drives output, saving, prices and jobs." },
  { n: 2, title: "The IS-LM-FE model", blurb: "Three curves, a recipe for shocks, and how an economy finds its way home." },
  { n: 3, title: "The open economy", blurb: "Exchange rates, trade, tariffs and the flow of capital across borders." },
  { n: 4, title: "Practice", blurb: "Mixed problems that put the whole toolkit to work." },
];

const worked = [
  "productivity-down", "money-supply-up", "gov-spending-up", "taxes-up",
  "wealth-up", "expected-inflation-up", "investment-outlook-up", "labour-tax-up",
];
const featured = ["productivity-down", "money-supply-up", "gov-spending-up"];

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
    n: 4, slug: "saving-investment", part: 1, title: "Saving and investment",
    summary: "Households save, firms invest, and the real interest rate brings the two together.",
    covers: ["Desired saving and what shifts it", "Desired investment and what shifts it", "The real interest rate that clears the market"],
  },
  {
    n: 5, slug: "money-inflation", part: 1, title: "Money and inflation",
    summary: "What people hold money for, what central banks control, and how inflation expectations enter.",
    covers: ["Money demand and the nominal interest rate", "How the money supply is set", "Inflation, expected inflation and the real rate"],
  },
  {
    n: 6, slug: "is-lm-fe", part: 2, title: "The IS-LM-FE model",
    summary: "Put the goods, money and labour markets on one picture and run a shock through it.",
    covers: ["The IS, LM and FE curves", "What each curve holds fixed", "Short-run and long-run equilibrium"],
    body: [
      "The model is three conditions drawn against output on the horizontal axis and the real interest rate on the vertical. The IS curve collects every pair of output and interest rate at which desired saving equals desired investment, so the goods market clears. The LM curve collects every pair at which the real money supply equals what people want to hold, so the money market clears. The FE line marks the output the economy produces when the labour market clears, with the real wage where labour demand meets labour supply. It is vertical because that level of output does not depend on the interest rate.",
      "In the short run prices are stuck, so the economy sits where IS and LM cross, wherever that is relative to FE. If output is above FE, firms and workers bid prices up; below it, prices slip. A price change alters real money balances, so it moves LM. The economy keeps sliding along until IS, LM and FE all meet at one point, which is the long run.",
      "Below, pick a shock and say what you expect to happen to nine variables, now and after prices have settled. Then step through the recipe and watch the same answer appear on the curves, in the three side markets, and along the time path.",
    ],
    takeaways: [
      "IS and LM set output and the interest rate in the short run; FE sets where output ends up.",
      "Every shock moves exactly one curve first; the table of shifts tells you which.",
      "Prices move until real money balances put LM back through the point where IS meets FE.",
    ],
    lab: { regime: "closed", shocks: featured, defaultShock: "productivity-down" },
  },
  {
    n: 7, slug: "recipe", part: 2, title: "The recipe",
    summary: "A fixed sequence of eight steps that turns any shock into a prediction.",
    covers: ["Naming the shock and the market it hits", "Moving a curve and finding the short-run point", "Letting prices adjust to the long-run point"],
    lab: { regime: "closed", shocks: worked, defaultShock: "money-supply-up" },
  },
  {
    n: 8, slug: "supply-demand-shocks", part: 2, title: "Supply and demand shocks",
    summary: "Shocks that move IS or LM against shocks that move FE, and how to tell them apart in the data.",
    covers: ["Demand shocks: spending and money", "Supply shocks: productivity, capital, labour", "Why prices and output move together or apart"],
    lab: { regime: "closed", shocks: worked, defaultShock: "productivity-down" },
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
    lab: { regime: "floating", mobility: 0.5, shocks: ["money-supply-up", "gov-spending-up", "foreign-rate-up"], defaultShock: "money-supply-up" },
  },
  {
    n: 11, slug: "open-economy", part: 3, title: "The open economy",
    summary: "Net exports inside IS, and how capital mobility changes what policy can do.",
    covers: ["Net exports and the real exchange rate", "Capital mobility from none to perfect", "Large and small economies"],
    lab: { regime: "floating", mobility: 0.5, shocks: ["gov-spending-up", "money-supply-up", "foreign-demand-up"], defaultShock: "gov-spending-up" },
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
  "demand-shocks": "supply-demand-shocks",
  "supply-shocks": "supply-demand-shocks",
  "price-adjustment": "recipe",
  "fiscal-policy": "supply-demand-shocks",
  "monetary-policy": "supply-demand-shocks",
  "policy-tradeoffs": "recessions",
  "floating-rates": "exchange-rates",
  "fixed-rates": "exchange-rates",
};
