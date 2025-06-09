import companiesData from '../mockData/companies.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let companies = [...companiesData];

const companiesService = {
  async getAll() {
    await delay(280);
    return [...companies];
  },

  async getById(id) {
    await delay(250);
    const company = companies.find(c => c.id === id);
    if (!company) {
      throw new Error('Company not found');
    }
    return { ...company };
  },

  async create(companyData) {
    await delay(420);
    const newCompany = {
      ...companyData,
      id: Date.now().toString(),
      annualRevenue: companyData.annualRevenue || 0
    };
    companies.push(newCompany);
    return { ...newCompany };
  },

  async update(id, companyData) {
    await delay(380);
    const index = companies.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Company not found');
    }
    companies[index] = { ...companies[index], ...companyData };
    return { ...companies[index] };
  },

  async delete(id) {
    await delay(320);
    const index = companies.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Company not found');
    }
    companies.splice(index, 1);
    return true;
  }
};

export default companiesService;