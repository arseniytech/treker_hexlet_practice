function getExpenses() {
  const data = localStorage.getItem('expenses');
  if (!data) return [];
  return JSON.parse(data);
}

function saveExpenses(list) {
  localStorage.setItem('expenses', JSON.stringify(list));
}

function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorEl = document.getElementById('error');

  if (!email || !password) {
    errorEl.textContent = 'Заполни все поля';
    return;
  }

  localStorage.setItem('user', email);
  window.location.href = 'index.html';
}

function saveExpense() {
  const amount = document.getElementById('amount').value;
  const date = document.getElementById('date').value;
  const category = document.getElementById('category').value;
  const description = document.getElementById('description').value;
  const errorEl = document.getElementById('error');

  if (!amount || !date) {
    errorEl.textContent = 'Укажи сумму и дату';
    return;
  }

  if (Number(amount) <= 0) {
    errorEl.textContent = 'Сумма должна быть больше нуля';
    return;
  }

  const expenses = getExpenses();
  const params = new URLSearchParams(window.location.search);
  const editId = params.get('id');

  if (editId) {
    //редакт
    for (let i = 0; i < expenses.length; i++) {
      if (expenses[i].id == editId) {
        expenses[i].amount = Number(amount);
        expenses[i].date = date;
        expenses[i].category = category;
        expenses[i].description = description;
        break;
      }
    }
  } else {
    const newExpense = {
      id: Date.now(),
      amount: Number(amount),
      date: date,
      category: category,
      description: description
    };
    expenses.push(newExpense);
  }

  saveExpenses(expenses);
  console.log('Сохранено, всего записей:', expenses.length);
  window.location.href = 'expenses.html';
}

function deleteExpense(id) {
  const expenses = getExpenses();
  const updated = [];
  for (let i = 0; i < expenses.length; i++) {
    if (expenses[i].id !== id) {
      updated.push(expenses[i]);
    }
  }
  saveExpenses(updated);
  renderExpenses();
}

function renderExpenses() {
  const tbody = document.getElementById('expenseTable');
  if (!tbody) return;

  const expenses = getExpenses();
  tbody.innerHTML = '';

  if (expenses.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="padding:16px 8px;color:#aaa">Расходов пока нет</td></tr>';
    return;
  }

  for (let i = 0; i < expenses.length; i++) {
    const e = expenses[i];
    const tr = document.createElement('tr');
    tr.innerHTML =
      '<td>' + e.date + '</td>' +
      '<td>' + e.category + '</td>' +
      '<td>' + (e.description || '—') + '</td>' +
      '<td>' + e.amount + ' ₽</td>' +
      '<td>' +
        '<button class="btnSmall btnGray" onclick="window.location.href=\'addExpense.html?id=' + e.id + '\'">ред.</button> ' +
        '<button class="btnSmall" onclick="deleteExpense(' + e.id + ')">удал.</button>' +
      '</td>';
    tbody.appendChild(tr);
  }
}

function renderStats() {
  const totalEl = document.getElementById('total');
  if (!totalEl) return;

  const expenses = getExpenses();

  let sum = 0;
  for (let i = 0; i < expenses.length; i++) {
    sum += expenses[i].amount;
  }
  totalEl.textContent = sum + ' ₽';
  document.getElementById('count').textContent = expenses.length;

  // топ кат
  if (expenses.length === 0) {
    document.getElementById('topCategory').textContent = '—';
    return;
  }

  const cats = {};
  for (let i = 0; i < expenses.length; i++) {
    const cat = expenses[i].category;
    if (cats[cat]) {
      cats[cat]++;
    } else {
      cats[cat] = 1;
    }
  }

  let topCat = '';
  let topCount = 0;
  for (const cat in cats) {
    if (cats[cat] > topCount) {
      topCount = cats[cat];
      topCat = cat;
    }
  }

  document.getElementById('topCategory').textContent = topCat;
}

function setActiveNav() {
  const current = window.location.pathname;
  const links = document.querySelectorAll('.navItem');
  for (let i = 0; i < links.length; i++) {
    const href = links[i].getAttribute('href');
    if (current.endsWith(href)) {
      links[i].classList.add('active');
    }
  }
}

// заполнить форму при редактировании
function prefillForm() {
  const params = new URLSearchParams(window.location.search);
  const editId = params.get('id');
  if (!editId) return;

  const expenses = getExpenses();
  let found = null;
  for (let i = 0; i < expenses.length; i++) {
    if (expenses[i].id == editId) {
      found = expenses[i];
      break;
    }
  }

  if (!found) return;

  document.getElementById('formTitle').textContent = 'Редактировать расход';
  document.getElementById('amount').value = found.amount;
  document.getElementById('date').value = found.date;
  document.getElementById('category').value = found.category;
  document.getElementById('description').value = found.description;
}

setActiveNav();
renderExpenses();
renderStats();
prefillForm();