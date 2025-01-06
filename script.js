const form = document.getElementById('form');
const search = document.getElementById('search');
const main = document.getElementById('main');

window.addEventListener('load', () => {
  search.value = '';
});

const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('User not found');
    }
    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
};

const fetchUser = async (username) => {
  const url = `https://api.github.com/users/${username}`;
  return fetchData(url);
};

const searchRepos = async (username) => {
  const url = `https://api.github.com/users/${username}/repos?sort=created&per_page=5`;
  const repos = await fetchData(url);
  return repos.error ? [] : repos;
};

const displayUser = (user, repos) => {
  if (user.error) {
    main.innerHTML = `<p class="user-not-found">No profile with this username</p>`;
    return;
  }

  let firstName = '';
  let lastName = '';

  if (user.name) {
    const nameParts = user.name.trim().split(' ');
    firstName = nameParts[0]; 
    lastName = nameParts.slice(1).join(' ') || ''; 
  }

  main.innerHTML = `
    <div class="card">
      <img src="${user.avatar_url}" alt="${user.login}" class="avatar" />
      <div class="user-info">
        <h2>${firstName} ${lastName}</h2>
        <p>${user.bio || 'No bio available'}</p>
        <ul>
          <li><strong>${user.followers}</strong> Followers</li>
          <li><strong>${user.following}</strong> Following</li>
          <li><strong>${user.public_repos}</strong> Repositories</li>
        </ul>
        <div id="repos">
          ${repos.map(repo => `<p class="repo">${repo.name}</p>`).join('')}
        </div>
      </div>
    </div>
  `;
};

const showError = (message) => {
  main.innerHTML = `<p class="user-not-found">${message}</p>`;
  search.value = ''; 
};

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const username = search.value.trim();

  if (username === '') {
    showError('Please enter a username');
    return;
  }

  const user = await fetchUser(username);
  const repos = await searchRepos(username);

  if (user.error) {
    showError('No profile with this username');
    return;
  }

  displayUser(user, repos);
  search.value = '';
});
