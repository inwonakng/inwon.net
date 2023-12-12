const projectsData = [
  // {
  //   title: 'A Search Engine',
  //   description: `What if you could look up any information in the world? Webpages, images, videos
  //   and more. Google has many features to help you find exactly what you're looking
  //   for.`,
  //   imgSrc: '/static/images/google.png',
  //   href: 'https://www.google.com',
  // },
  // {
  //   title: 'The Time Machine',
  //   description: `Imagine being able to travel back in time or to the future. Simple turn the knob
  //   to the desired date and press "Go". No more worrying about lost keys or
  //   forgotten headphones with this simple yet affordable solution.`,
  //   imgSrc: '/static/images/time-machine.jpg',
  //   href: '/blog/the-time-machine',
  // },
  {
    title: 'Private Supply Chain using Chainlink CCIP',
    description: `Our submission for Chalink Constellation Hackathon 2023.
    Implemented a supply chain scenario using Chainlink's CCIP protocol and Circom's ZK circuits to enable a private supply chain solution.
    `,
    imgSrc: '/static/images/chainlink-ccip-zk-supply-chain/chainlink-constellation-hackathon-banner.png',
    href: '/blog/chainlink-ccip-zk-supply-chain',
  },
  {
    title: 'Crowdsourcing on Algorand',
    description: `Submission for Algorand foundation's Mega Ace Hackathon project. 
    Implemented a full-stack app that uses Algorand as the backend for creating arbitrary data repositories that can receive submissions from anyone on the blockchain.
    `,
    imgSrc: '/static/images/crowdsourcing-on-algorand/algorand-mega-ace-hackathon.png',
    href: '/blog/crowdsourcing-on-algorand',
  },
  {
    title: 'Robust Federated Learning',
    description: `Class project for Security and Privacy of Machine Learing. 
    Built a framework mimicing pytorch API to implement aggregator functions and simulate federated learning situations with delays in client updates.
    Also implemented a new aggregation method using Agglomerative Clustering, as well as designing/implementing an improved version of staleness weighting function.`,
    imgSrc: '/static/images/robust-fl/diagram.png',
    href: '/blog/robust-fl',
  },
  {
    title: 'Clean My Web (WIP)',
    description: `Class project for AI and Blockchain. 
    Developed a chrome extension that can insert html into google search results and filters "spam" results. 
    Uses Ethereum Network (currently Goerli testnet) to store user labeled data to update the shared model.`,
    imgSrc: '/static/images/clean-my-web/youtube-screenshot.png',
    href: '/blog/clean-my-web',
  },
  {
    title: 'Understanding Perception of Gerrymandering',
    description: `Built a website using google sheets API to collect responses for people's perception of Gerrymandering.
    Also built a tool for creating custom maps.
    `,
    imgSrc: '/static/images/crowdsource-gerrymandering/survey-site-screenshot.png',
    href: '/blog/crowdsource-gerrymandering',
  },
  {
    title: 'Critical Infrastructures of Northeastern US',
    description: `Class project for Xinformatics. 
    Worked with a team to gather various geographic data on the northeastern region to create 
    a regression model of possible landslide danger to the power infrastructures of Northeastern US. 
    Built an interactive platform to view each infrastructures and also filter by danger level/state region.`,
    imgSrc: '/static/images/critical-infrastructures/dashboard-screenshot.png',
    href: '/blog/critical-infrastructures',
  },
]

export default projectsData
