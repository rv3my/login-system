const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');
const dashboard = document.getElementById('dashboard');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const userAvatar = document.getElementById('userAvatar');

function hash(password) {
  return CryptoJS.SHA256(password).toString();
}

signupForm.onsubmit = function(e) {
  e.preventDefault();
  const username = document.getElementById('signupUser').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPass').value;
  const avatarFile = document.getElementById('signupAvatar').files[0];

  if (localStorage.getItem(`user_${username}`)) {
    return alert('Username already exists.');
  }

  const reader = new FileReader();
  reader.onload = function() {
    const avatarData = reader.result;
    const userData = {
      username,
      email,
      password: hash(password),
      avatar: avatarData
    };
    localStorage.setItem(`user_${username}`, JSON.stringify(userData));
    alert('Signup successful!');
    signupForm.reset();
  };
  if (avatarFile) reader.readAsDataURL(avatarFile);
  else reader.onload();
};

loginForm.onsubmit = function(e) {
  e.preventDefault();
  const username = document.getElementById('loginUser').value;
  const password = hash(document.getElementById('loginPass').value);
  const remember = document.getElementById('rememberMe').checked;
  const user = JSON.parse(localStorage.getItem(`user_${username}`));

  if (user && user.password === password) {
    sessionStorage.setItem('loggedInUser', username);
    if (remember) localStorage.setItem('rememberUser', username);
    loadDashboard(user);
  } else {
    alert('Invalid username or password');
  }
};

function loadDashboard(user) {
  document.querySelector('.card').classList.add('hidden');
  loginForm.parentElement.classList.add('hidden');
  signupForm.parentElement.classList.add('hidden');
  dashboard.classList.remove('hidden');
  userName.textContent = user.username;
  userEmail.textContent = user.email;
  userAvatar.src = user.avatar || '';
}

function logout() {
  sessionStorage.removeItem('loggedInUser');
  localStorage.removeItem('rememberUser');
  location.reload();
}

const rememberedUser = localStorage.getItem('rememberUser');
const sessionUser = sessionStorage.getItem('loggedInUser');
const activeUser = rememberedUser || sessionUser;

if (activeUser) {
  const user = JSON.parse(localStorage.getItem(`user_${activeUser}`));
  if (user) loadDashboard(user);
}
