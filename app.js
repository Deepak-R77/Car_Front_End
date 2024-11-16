const app = document.getElementById('app');

let users = [];
let loggedInUser = null;
let cars = [];

function render() {
  if (!loggedInUser) {
    renderLoginSignupPage();
  } else {
    renderCarListPage();
  }
}

// Login/Signup Page
function renderLoginSignupPage() {
  app.innerHTML = `
    <h2>Car Management App</h2>
    <form id="authForm">
      <label>Username:</label>
      <input type="text" id="username" required>
      <label>Password:</label>
      <input type="password" id="password" required>
      <button type="submit">Login</button>
      <button type="button" id="signup">Sign Up</button>
    </form>
  `;

  document.getElementById('authForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const user = users.find((u) => u.username === username && u.password === password);
    if (user) {
      loggedInUser = username;
      render();
    } else {
      alert('Invalid login credentials!');
    }
  });

  document.getElementById('signup').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (users.some((u) => u.username === username)) {
      alert('Username already exists!');
    } else {
      users.push({ username, password });
      alert('Sign up successful!');
    }
  });
}

// Car List Page
function renderCarListPage() {
  const userCars = cars.filter((car) => car.owner === loggedInUser);

  app.innerHTML = `
    <h2>Welcome, ${loggedInUser}</h2>
    <input type="text" id="searchBar" placeholder="Search cars..." />
    <button id="addCar">Add Car</button>
    <div id="carList">
      ${userCars
        .map(
          (car, index) => `
        <div class="car" onclick="viewCar(${index})">
          <h3>${car.title}</h3>
        </div>
      `
        )
        .join('')}
    </div>
    <button id="logout">Logout</button>
  `;

  document.getElementById('searchBar').addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase();
    const filteredCars = userCars.filter(
      (car) =>
        car.title.toLowerCase().includes(keyword) ||
        car.description.toLowerCase().includes(keyword) ||
        car.tags.some((tag) => tag.toLowerCase().includes(keyword))
    );
    renderCarList(filteredCars);
  });

  document.getElementById('addCar').addEventListener('click', renderAddCarPage);
  document.getElementById('logout').addEventListener('click', () => {
    loggedInUser = null;
    render();
  });
}

function renderCarList(carsToRender) {
  document.getElementById('carList').innerHTML = carsToRender
    .map(
      (car, index) => `
    <div class="car" onclick="viewCar(${index})">
      <h3>${car.title}</h3>
    </div>
  `
    )
    .join('');
}

// Add Car Page
function renderAddCarPage() {
  app.innerHTML = `
    <h2>Add a Car</h2>
    <form id="addCarForm">
      <label>Title:</label>
      <input type="text" id="title" required>
      <label>Description:</label>
      <textarea id="description" required></textarea>
      <label>Tags (comma separated):</label>
      <input type="text" id="tags" required>
      <label>Images:</label>
      <input type="file" id="images" accept="image/*" multiple>
      <button type="submit">Add Car</button>
      <button type="button" id="back">Back</button>
    </form>
  `;

  document.getElementById('addCarForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const tags = document.getElementById('tags').value.split(',').map((t) => t.trim());
    const images = Array.from(document.getElementById('images').files)
      .slice(0, 10)
      .map((file) => URL.createObjectURL(file));

    cars.push({ title, description, tags, images, owner: loggedInUser });
    renderCarListPage();
  });

  document.getElementById('back').addEventListener('click', renderCarListPage);
}

// Initial Render
render();
