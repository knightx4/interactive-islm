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
