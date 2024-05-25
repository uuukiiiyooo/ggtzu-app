// Populate the food dropdown
function populateFoodDropdown() {
  const foodSelect = document.getElementById('product');
  foodData.forEach(food => {
    const option = document.createElement('option');
    option.value = food.name;
    option.textContent = food.name;
    foodSelect.appendChild(option);
  });
}

// Functions to handle form submission and calculations
let totalCalories = 0;

function addPhysiologicalData(event) {
  event.preventDefault();
  const form = document.getElementById('physiological-form');
  const formData = new FormData(form);
  const userData = {};
  formData.forEach((value, key) => {
    userData[key] = value;
  });

  const weight = parseFloat(userData.weight);
  const height = parseFloat(userData.height);
  const age = parseInt(userData.age);

  let baseCalories;
  if (userData['sex'] === 'male') {
    baseCalories = (10 * weight) + (6.25 * height) - (5 * age) + 5;
  } else {
    baseCalories = (10 * weight) + (6.25 * height) - (5 * age) - 161;
  }
  const requiredCalories = baseCalories + (baseCalories * 0.1);
  document.getElementById('required-calories').innerText = requiredCalories.toFixed();

  const multiplier = document.getElementById('multiplier');
  const trainingCaloriesInput = document.getElementById('training-calories');
  const carbsPercentage = document.getElementById('carbs-percentage');
  const proteinPercentage = document.getElementById('protein-percentage');
  const fatPercentage = document.getElementById('fat-percentage');

  function updateTotals() {
    const trainingCaloriesValue = parseFloat(trainingCaloriesInput.value) || 0;
    const multiplierValue = parseFloat(multiplier.value) || 0;
    const adjustedCalories = requiredCalories + ((requiredCalories * multiplierValue) / 100);
    totalCalories = adjustedCalories + trainingCaloriesValue;
    document.getElementById('total-calories-value').innerText = totalCalories.toFixed();

    const carbsPercentageValue = parseFloat(carbsPercentage.value) || 0;
    const proteinPercentageValue = parseFloat(proteinPercentage.value) || 0;
    const fatPercentageValue = parseFloat(fatPercentage.value) || 0;

    const carbsGkg = ((carbsPercentageValue * totalCalories) / 100) / 4 / weight;
    const proteinGkg = ((proteinPercentageValue * totalCalories) / 100) / 4 / weight;
    const fatGkg = ((fatPercentageValue * totalCalories) / 100) / 9 / weight;

    document.getElementById('carbs-grkg').innerText = carbsGkg.toFixed(2);
    document.getElementById('protein-grkg').innerText = proteinGkg.toFixed(2);
    document.getElementById('fat-grkg').innerText = fatGkg.toFixed(2);
    
    updateFoodInformation();
  }

  multiplier.addEventListener('change', updateTotals);
  trainingCaloriesInput.addEventListener('input', updateTotals);
  carbsPercentage.addEventListener('input', updateTotals);
  proteinPercentage.addEventListener('input', updateTotals);
  fatPercentage.addEventListener('input', updateTotals);

  trainingCaloriesInput.dispatchEvent(new Event('input'));

  document.getElementById('calculate-button').style.display = 'none';
  document.getElementById('calories-count').style.display = 'block';
  document.getElementById('reset-button-row').style.display = 'block';
  document.getElementById('diet-type').style.display = 'block';
  document.getElementById('food-information').style.display = 'block';
}

// Function to calculate and display food information percentages
function updateFoodInformation() {
  const foodSelect = document.getElementById('product');
  const selectedFood = foodData.find(food => food.name === foodSelect.value);

  if (!selectedFood) return;

  const carbsPercentageValue = parseFloat(document.getElementById('carbs-percentage').value) || 0;
  const proteinPercentageValue = parseFloat(document.getElementById('protein-percentage').value) || 0;
  const fatPercentageValue = parseFloat(document.getElementById('fat-percentage').value) || 0;

  const totalCarbsNeeded = ((carbsPercentageValue * totalCalories) / 100) / 4;
  const totalProteinNeeded = ((proteinPercentageValue * totalCalories) / 100) / 4;
  const totalFatNeeded = ((fatPercentageValue * totalCalories) / 100) / 9;

  const carbsFilled = (selectedFood.carbs / totalCarbsNeeded) * 100;
  const proteinFilled = (selectedFood.protein / totalProteinNeeded) * 100;
  const fatFilled = (selectedFood.fat / totalFatNeeded) * 100;
  const sodiumFilled = (selectedFood.sodium / 2000) *100

  const measure = (selectedFood.measure);
  const servingSize = (selectedFood.serving);
  const packageSize = (selectedFood.package);
  const servingsPerPackage = packageSize / servingSize;

  const carbsPerPackage = carbsFilled * servingsPerPackage;
  const proteinPerPackage = proteinFilled * servingsPerPackage;
  const fatPerPackage = fatFilled * servingsPerPackage;
  const sodiumPerPackage = sodiumFilled * servingsPerPackage;

  document.getElementById('serving-size').innerText = servingSize.toFixed() + measure;
  document.getElementById('package-size').innerText = packageSize.toFixed() + measure;
  document.getElementById('servings-per-package').innerText = servingsPerPackage.toFixed(1);
  document.getElementById('package-carbs-percentage').innerText = carbsPerPackage.toFixed() + '%';
  document.getElementById('package-protein-percentage').innerText = proteinPerPackage.toFixed() + '%';
  document.getElementById('package-fat-percentage').innerText = fatPerPackage.toFixed() + '%';
  document.getElementById('package-sodium-percentage').innerText = sodiumPerPackage.toFixed() + '%';
  document.getElementById('food-carbs-percentage').innerText = carbsFilled.toFixed() + '%';
  document.getElementById('food-protein-percentage').innerText = proteinFilled.toFixed() + '%';
  document.getElementById('food-fat-percentage').innerText = fatFilled.toFixed() + '%';
  document.getElementById('food-sodium-percentage').innerText = sodiumFilled.toFixed() + '%';
}

document.addEventListener('DOMContentLoaded', () => {
  populateFoodDropdown();
  document.getElementById('product').addEventListener('change', updateFoodInformation);
});
