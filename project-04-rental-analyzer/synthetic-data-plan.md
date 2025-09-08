# Rental Property Analyzer - Synthetic Data & Financial Models

## 🏠 **Synthetic Property Dataset**

### **Property Data Schema**
```csv
property_id,address,city,state,zip_code,property_type,bedrooms,bathrooms,sqft,lot_size,year_built,purchase_price,current_market_value,monthly_rent,property_taxes,insurance,maintenance_budget,vacancy_rate,appreciation_rate,notes
```

### **Sample Properties (20 diverse examples)**
```csv
PROP_001,"123 Maple St","Austin","TX",78701,"Single Family",3,2,1500,0.25,1995,285000,320000,2400,4500,1800,2000,5,3.2,"Great neighborhood, near tech companies"
PROP_002,"456 Oak Ave","Denver","CO",80202,"Duplex",4,3,2200,0.18,1988,420000,465000,3200,6200,2100,2800,7,4.1,"Duplex - good rental income potential"
PROP_003,"789 Pine Rd","Nashville","TN",37203,"Condo",2,2,1100,0,2010,225000,240000,1800,2400,1200,1500,4,2.8,"Downtown condo, high walkability"
PROP_004,"321 Cedar Dr","Phoenix","AZ",85001,"Single Family",4,2,1800,0.3,2001,310000,345000,2600,3800,1600,2200,6,3.5,"Desert landscaping, low water costs"
PROP_005,"654 Birch Ln","Raleigh","NC",27601,"Townhouse",3,2.5,1650,0.05,2005,275000,295000,2200,3200,1400,1800,5,2.9,"Family-friendly neighborhood"
```

### **Market Data Integration**
```csv
market_id,city,state,median_home_price,rental_yield_avg,appreciation_5yr,vacancy_rate_avg,property_tax_rate,cap_rate_avg,market_trend
MKT_001,"Austin","TX",450000,6.8,8.2,4.2,1.81,5.2,"Strong Growth"
MKT_002,"Denver","CO",520000,5.9,7.8,3.8,0.51,4.8,"Stable Growth"  
MKT_003,"Nashville","TN",385000,7.2,9.1,5.1,0.64,6.1,"Hot Market"
```

## 📊 **Financial Modeling Framework**

### **Core Financial Calculations**

#### **1. Cash-on-Cash Return**
```python
def cash_on_cash_return(annual_cash_flow, initial_investment):
    """
    Measures annual pre-tax cash flow as percentage of initial investment
    Industry benchmark: 8-12% is good for rental properties
    """
    return (annual_cash_flow / initial_investment) * 100

# Example: $3,600 annual cash flow / $45,000 down payment = 8%
```

#### **2. Cap Rate (Capitalization Rate)**
```python
def cap_rate(net_operating_income, property_value):
    """
    Measures property profitability independent of financing
    Industry benchmark: 4-10% depending on market and risk
    """
    return (net_operating_income / property_value) * 100

# Example: $18,000 NOI / $300,000 value = 6% cap rate
```

#### **3. Gross Rent Multiplier (GRM)**
```python
def gross_rent_multiplier(property_price, annual_rent):
    """
    Quick valuation metric - lower is generally better
    Industry benchmark: 4-7 is favorable for investors
    """
    return property_price / annual_rent

# Example: $300,000 price / $28,800 rent = 10.4 GRM (high)
```

#### **4. Net Operating Income (NOI)**
```python
def net_operating_income(gross_rent, operating_expenses):
    """
    Annual rental income minus operating expenses (no debt service)
    Key metric for property valuation and investment analysis
    """
    return gross_rent - operating_expenses

# Operating expenses include: taxes, insurance, maintenance, vacancy allowance
```

#### **5. Total Return on Investment**
```python
def total_roi(annual_cash_flow, principal_paydown, appreciation, initial_investment):
    """
    Comprehensive return including cash flow, equity buildup, and appreciation
    Shows complete investment performance picture
    """
    total_annual_return = annual_cash_flow + principal_paydown + appreciation
    return (total_annual_return / initial_investment) * 100
```

### **Advanced Financial Models**

#### **10-Year Investment Projection**
```python
class RentalPropertyProjection:
    def __init__(self, property_data):
        self.property = property_data
        self.years = 10
        
    def calculate_projection(self):
        projection = []
        for year in range(1, self.years + 1):
            # Rent increases (inflation + market growth)
            current_rent = self.property.rent * (1 + 0.03) ** year
            
            # Property appreciation
            current_value = self.property.value * (1 + self.property.appreciation_rate/100) ** year
            
            # Mortgage paydown (if financed)
            remaining_balance = self.calculate_mortgage_balance(year)
            equity = current_value - remaining_balance
            
            projection.append({
                'year': year,
                'rent': current_rent,
                'value': current_value,
                'equity': equity,
                'cash_flow': self.calculate_cash_flow(current_rent),
                'total_return': self.calculate_total_return(year)
            })
        return projection
```

## 🤖 **CrewAI Financial Analysis Agents**

### **Agent 1: Market Research Specialist**
- **Role**: Real Estate Market Analyst
- **Goal**: Assess local market conditions and investment climate
- **Backstory**: Former real estate agent with deep market analysis experience
- **Tasks**: 
  - Analyze comparable properties and market trends
  - Assess neighborhood growth potential and risks
  - Evaluate rental demand and competition

### **Agent 2: Financial Modeling Expert**  
- **Role**: Investment Finance Specialist
- **Goal**: Calculate comprehensive financial metrics and projections
- **Backstory**: Former investment banker specializing in real estate finance
- **Tasks**:
  - Calculate ROI, cap rate, cash-on-cash return
  - Create 10-year investment projections
  - Analyze financing options and impact

### **Agent 3: Risk Assessment Analyst**
- **Role**: Investment Risk Specialist  
- **Goal**: Identify and quantify investment risks
- **Backstory**: Insurance and risk management professional
- **Tasks**:
  - Assess market risk, vacancy risk, maintenance risk
  - Evaluate property condition and major repair likelihood
  - Recommend risk mitigation strategies

### **Agent 4: Investment Strategist**
- **Role**: Real Estate Investment Advisor
- **Goal**: Provide actionable investment recommendations
- **Backstory**: Portfolio manager for real estate investment funds
- **Tasks**:
  - Synthesize all analysis into clear recommendations
  - Compare properties and rank investment potential
  - Suggest portfolio diversification strategies

## 📈 **Analysis Report Structure**

### **Executive Summary**
```
🏠 Property: 123 Maple St, Austin, TX
💰 Investment Grade: B+ (Good Investment)
📊 Key Metrics:
   • Cap Rate: 6.2% (Market Average: 5.8%)
   • Cash-on-Cash Return: 9.1% (Target: 8%+) ✅
   • Total ROI (10-year): 12.3% annually
   • Break-even Occupancy: 87%

🎯 Recommendation: PROCEED with caution
```

### **Financial Analysis**
- **Purchase Analysis**: Down payment, closing costs, initial investment
- **Cash Flow Analysis**: Monthly/annual income vs expenses  
- **Return Metrics**: All key ratios with benchmarks
- **Financing Impact**: Cash vs financed scenarios
- **10-Year Projection**: Wealth building potential

### **Market Analysis**
- **Neighborhood Assessment**: Growth trends, amenities, schools
- **Rental Market**: Demand, competition, rent trends
- **Appreciation Potential**: Historical and projected value growth
- **Exit Strategy**: Resale prospects and market liquidity

### **Risk Assessment**
- **Market Risks**: Economic downturn, oversupply, rate changes
- **Property Risks**: Age, condition, major repairs needed
- **Financial Risks**: Vacancy, rent collection, unexpected costs
- **Mitigation Strategies**: Insurance, reserves, screening processes

## 🎓 **Student Learning Objectives**

### **Financial Literacy**
- Understand real estate investment fundamentals
- Learn to calculate and interpret key investment metrics
- Appreciate the complexity of investment decision-making

### **Multi-Agent Coordination**
- See how different expertise areas work together
- Understand specialization in complex analysis tasks
- Learn to synthesize multiple perspectives into decisions

### **Business Applications**
- Real-world investment analysis skills
- Understanding of risk assessment frameworks
- Professional report generation and presentation

### **Data Analysis**
- Working with financial data and calculations
- Creating projections and scenario analysis
- Presenting complex data in understandable formats

## 💡 **Student Customization Opportunities**

### **Easy Modifications**
- Change financial assumptions (appreciation rates, rent growth)
- Add new properties to analyze and compare
- Modify risk tolerance and investment criteria

### **Medium Modifications**  
- Add new financial metrics (DSCR, IRR, etc.)
- Create different market scenarios (recession, boom)
- Integrate additional data sources

### **Advanced Modifications**
- Build portfolio optimization features
- Add machine learning for market predictions
- Create interactive financial calculators
- Integrate with real estate APIs for live data

This project teaches practical financial analysis while demonstrating sophisticated multi-agent AI coordination - skills students can use immediately in their careers!