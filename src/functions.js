// Functions to handle form submission and calculations

// Function to collect and add physiological data
function addPhysiologicalData(event) {
  // Prevent page reload when clicking the button
  event.preventDefault(); 
  // Get the form element
  const form = document.getElementById('physiological-form');
  // Create a FormData object from the form
  const formData = new FormData(form);
  // Create an object to hold the form data
  const userData = {};
  // Iterate over the FormData entries and add them to the userData object
  formData.forEach(function(value, key) {
    userData[key] = value;
  });

  
  // Log the userData object to the console
  console.log(userData);
  console.log(userData['height'], typeof userData['height']); 

  // Extract and convert the values
  const weight = parseFloat(userData.weight);
  const height = parseFloat(userData.height);
  const age = parseInt(userData.age);
  console.log("Weight (kg):", weight);
  console.log("Height (cm):", height);
  console.log("Age (years):", age);
  console.log(typeof weight, typeof height, typeof age); 


  //Calculae Required Calories using formula based on sex
  let baseCalories;
  if (userData['sex'] === 'male') {
    baseCalories = (10 * weight) + (6.25 * height) - (5 * age) + 5;
  } else {
    baseCalories = (10 * weight) + (6.25 * height) - (5 * age) - 161;
  }
  const requiredCalories = baseCalories + (baseCalories * 0.1);
  //Display Required Calories
  document.getElementById('required-calories').innerText = requiredCalories.toFixed();

  //Get the Training Calories and Multiplier inputs to calculate Total Calories
  const trainingCaloriesInput = document.getElementById('training-calories');
  const multiplier = document.getElementById('multiplier');

  //Update Total Calories whenever Training Calories or Multiplier input changes
  function updateTotalCalories() {
    const trainingCaloriesValue = parseFloat(trainingCaloriesInput.value) || 0;
    const multiplierValue = parseFloat(multiplier.value) || 0;
    const adjustedCalories = requiredCalories + ((requiredCalories * multiplierValue) / 100);
    const totalCalories = adjustedCalories + trainingCaloriesValue;
    document.getElementById('total-calories-value').innerText = totalCalories.toFixed();
  }

  trainingCaloriesInput.addEventListener('input', updateTotalCalories);
  multiplier.addEventListener('change', updateTotalCalories);

  //Trigger the input event to initialize Total Calories display
  trainingCaloriesInput.dispatchEvent(new Event('input'));

  //Hides button and shows calories rows
  document.getElementById('calculate-button').style.display = 'none';
  document.getElementById('calories-count').style.display = 'ruby';
  document.getElementById('total-calories').style.display = 'ruby-text';
}