const projectsFolder = ["PiBook", "MDF CNC"]; // List your project folders here

// Home View
async function loadHome() {
  document.getElementById('home-view').style.display = 'block';
  document.getElementById('project-view').style.display = 'none';
  document.getElementById('version-view').style.display = 'none';

  const list = document.getElementById('project-list');
  list.innerHTML = '';

  for (let p of projectsFolder) {
    const meta = await fetch(`projects/${p}/metadata.json`).then(r => r.json());
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="projects/${p}/${meta.thumbnail}" alt="${meta.name}">
      <h3>${meta.name}</h3>
      <p>${meta.description}</p>
    `;
    card.onclick = () => loadProject(p);
    list.appendChild(card);
  }
}

// Project View
async function loadProject(project) {
  document.getElementById('home-view').style.display = 'none';
  document.getElementById('project-view').style.display = 'block';
  document.getElementById('version-view').style.display = 'none';

  const meta = await fetch(`projects/${project}/metadata.json`).then(r => r.json());
  document.getElementById('project-title').textContent = meta.name;
  document.getElementById('project-desc').textContent = meta.description;

  const list = document.getElementById('version-list');
  list.innerHTML = '';

  meta.versions.forEach(v => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="projects/${project}/${v.files.images[0]}" alt="${v.title}">
      <h4>${v.title}</h4>
      <p>${v.description}</p>
    `;
    card.onclick = () => loadVersion(project, v.id);
    list.appendChild(card);
  });

  document.getElementById('back-to-home').onclick = loadHome;
}

// Version View
async function loadVersion(project, versionId) {
  document.getElementById('home-view').style.display = 'none';
  document.getElementById('project-view').style.display = 'none';
  document.getElementById('version-view').style.display = 'block';

  const meta = await fetch(`projects/${project}/metadata.json`).then(r => r.json());
  const version = meta.versions.find(v => v.id === versionId);

  document.getElementById('version-title').textContent = `${meta.name} - ${version.title}`;
  document.getElementById('version-desc').textContent = version.description;

  const content = document.getElementById('version-content');
  content.innerHTML = '';

  // Images
  version.files.images.forEach(img => {
    const i = document.createElement('img');
    i.src = `projects/${project}/${version.id}/${img}`;
    content.appendChild(i);
  });

  // Videos
  version.files.videos.forEach(vid => {
    const v = document.createElement('video');
    v.src = `projects/${project}/${version.id}/${vid}`;
    v.controls = true;
    content.appendChild(v);
  });

  // README content inline
  if (version.files.docs) {
    const docContainer = document.createElement('div');
    docContainer.className = 'readme';
    content.appendChild(docContainer);

    fetch(`projects/${project}/${version.id}/${version.files.docs}`)
      .then(r => r.text())
      .then(text => {
        let html = text
          .replace(/^### (.*$)/gim, '<h3>$1</h3>')
          .replace(/^## (.*$)/gim, '<h2>$1</h2>')
          .replace(/^# (.*$)/gim, '<h1>$1</h1>')
          .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
          .replace(/\*(.*)\*/gim, '<i>$1</i>')
          .replace(/\n/g, '<br>');
        docContainer.innerHTML = html;
      });
  }

  document.getElementById('back-to-project').onclick = () => loadProject(project);
}

// Initial load
loadHome();
