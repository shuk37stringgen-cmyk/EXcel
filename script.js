const denoms = [10000, 5000, 2000, 1000, 500, 100, 50, 10, 5, 1];
const isBar = (v) => v <= 500;

function init() {
    denoms.forEach(v => {
        document.getElementById('tbody1').innerHTML += `<tr id="r1-${v}"><td>${v}</td><td><input type="number" class="cl" data-v="${v}" oninput="calc()"></td><td class="cb-cell"></td><td><input type="number" class="al" data-v="${v}" oninput="calc()"></td><td class="ab-cell"></td><td id="cnt1-${v}">0</td><td id="res1-${v}">0</td></tr>`;
        document.getElementById('tbody2').innerHTML += `<tr id="r2-${v}"><td>${v}</td><td><input type="number" class="safe-l" data-v="${v}" oninput="calc()"></td><td class="safe-b-cell"></td><td id="cnt2-${v}">0</td><td id="res2-${v}">0</td></tr>`;
        document.getElementById('tbody3').innerHTML += `<tr id="r3-${v}"><td>${v}</td><td id="safe-val-${v}">0</td><td><input type="number" class="leave-l" data-v="${v}" oninput="calc()"></td><td class="leave-b-cell"></td><td id="cnt3-${v}">0</td><td id="ret-${v}">0</td></tr>`;
    });
    denoms.forEach(v => { if (isBar(v)) document.querySelector(`#r1-${v} .cb-cell`).innerHTML = `<input type="number" class="cb" data-v="${v}" oninput="calc()">`; });
    denoms.forEach(v => { if (isBar(v)) document.querySelector(`#r1-${v} .ab-cell`).innerHTML = `<input type="number" class="ab" data-v="${v}" oninput="calc()">`; });
    denoms.forEach(v => { if (isBar(v)) document.querySelector(`#r2-${v} .safe-b-cell`).innerHTML = `<input type="number" class="safe-b" data-v="${v}" oninput="calc()">`; });
    denoms.forEach(v => { if (isBar(v)) document.querySelector(`#r3-${v} .leave-b-cell`).innerHTML = `<input type="number" class="leave-b" data-v="${v}" oninput="calc()">`; });

    const saved = JSON.parse(localStorage.getItem('regiData') || '{}');
    document.querySelectorAll('input').forEach(i => i.value = saved[i.className + i.dataset.v] || '');
    calc();
    setTimeout(() => { document.getElementById('loading-screen').style.display = 'none'; }, 1000);
}

function calc() {
    let t1cnt = 0, t1price = 0, t2cnt = 0, t2price = 0, adj = 0, nittsu = 0;
    denoms.forEach(v => {
        const cl = +document.querySelector(`.cl[data-v="${v}"]`)?.value || 0, cb = +document.querySelector(`.cb[data-v="${v}"]`)?.value || 0;
        const al = +document.querySelector(`.al[data-v="${v}"]`)?.value || 0, ab = +document.querySelector(`.ab[data-v="${v}"]`)?.value || 0;
        const sl = +document.querySelector(`.safe-l[data-v="${v}"]`)?.value || 0, sb = +document.querySelector(`.safe-b[data-v="${v}"]`)?.value || 0;
        const ll = +document.querySelector(`.leave-l[data-v="${v}"]`)?.value || 0, lb = +document.querySelector(`.leave-b[data-v="${v}"]`)?.value || 0;

        const count1 = cl + al + (cb + ab) * 50;
        const price1 = count1 * v;
        const count2 = sl + sb * 50;
        const price2 = count2 * v;
        const count3 = ll + lb * 50;

        document.getElementById(`cnt1-${v}`).innerText = count1.toLocaleString();
        document.getElementById(`res1-${v}`).innerText = price1.toLocaleString();
        document.getElementById(`cnt2-${v}`).innerText = count2.toLocaleString();
        document.getElementById(`res2-${v}`).innerText = price2.toLocaleString();
        document.getElementById(`cnt3-${v}`).innerText = (count2 - count3).toLocaleString();
        document.getElementById(`ret-${v}`).innerText = ((count2 - count3) * v).toLocaleString();

        t1cnt += count1; t1price += price1; t2cnt += count2; t2price += price2;
        adj += (al + ab * 50) * v; nittsu += (count2 - count3) * v;
    });

    // 文字化け対策として「枚」を \u679A、「円」を \u5186 で出力しています
    document.getElementById('grand-total1').innerText = t1cnt.toLocaleString() + ' \u679A';
    document.getElementById('total-price1').innerHTML = t1price.toLocaleString() + ' \u5186';
    document.getElementById('adj-total').innerHTML = adj.toLocaleString() + ' \u5186';
    document.getElementById('grand-total2').innerText = t2cnt.toLocaleString() + ' \u679A';
    document.getElementById('total-price2').innerHTML = t2price.toLocaleString() + ' \u5186';
    document.getElementById('nittsu-total').innerHTML = nittsu.toLocaleString() + ' \u5186';

    const data = {}; document.querySelectorAll('input').forEach(i => data[i.className + i.dataset.v] = i.value);
    localStorage.setItem('regiData', JSON.stringify(data));
}
function showPage(n) { document.querySelectorAll('.page').forEach(p => p.classList.remove('active')); document.getElementById('page' + n).classList.add('active'); }
function resetData() { if (confirm('\u5168\u30c7\u30fc\u30bf\u6d88\u53bb\u3057\u307e\u3059\u304b\uff1f')) { localStorage.removeItem('regiData'); location.reload(); } }
init();