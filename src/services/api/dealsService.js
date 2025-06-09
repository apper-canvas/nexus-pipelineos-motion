import dealsData from '../mockData/deals.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let deals = [...dealsData];

const dealsService = {
  async getAll() {
    await delay(320);
    return [...deals];
  },

  async getById(id) {
    await delay(250);
    const deal = deals.find(d => d.id === id);
    if (!deal) {
      throw new Error('Deal not found');
    }
    return { ...deal };
  },

  async create(dealData) {
    await delay(450);
    const newDeal = {
      ...dealData,
      id: Date.now().toString(),
      stage: dealData.stage || 'lead',
      probability: dealData.probability || 10,
      closeDate: dealData.closeDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      owner: dealData.owner || 'John Doe'
    };
    deals.push(newDeal);
    return { ...newDeal };
  },

  async update(id, dealData) {
    await delay(380);
    const index = deals.findIndex(d => d.id === id);
    if (index === -1) {
      throw new Error('Deal not found');
    }
    deals[index] = { ...deals[index], ...dealData };
    return { ...deals[index] };
  },

  async delete(id) {
    await delay(340);
    const index = deals.findIndex(d => d.id === id);
    if (index === -1) {
      throw new Error('Deal not found');
    }
    deals.splice(index, 1);
    return true;
  }
};

export default dealsService;