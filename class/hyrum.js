// 預定義的名字和對應組別
// const names = ["Alice", "Bob", "Charlie", "Diana", "徐瑋軒", '犯研約', '黃翰源', '楊恩雅'];
const groups = ["img/A.jpg", "img/B.jpg", "img/C.jpg", "img/D.jpg"];
// const preAssignedGroups = {
//     "徐瑋軒": 2,
//     '楊恩雅': 3,
//     '黃翰源': 1,
//     "犯研約": 0,
//     "Alice": 0, // 0對應 group1.png
//     "Bob": 1,   // 1對應 group2.png
//     "Charlie": 2, // 2對應 group3.png
//     "Diana": 3  // 3對應 group4.png
// };
const names = ['吳頔', '董世亮', '吳與倫', '酉璦', '苡沁', '陳信蓉', '陳真泰', '晉澤', '吳限', '張詠晴', '陳雨青', '尤喜恩', '游芷彤', '陳信豪', '丁康豪', '酉謙', '陳照希', '吳祈悠', '尤樂恩', '游子琪', '陳建榮', '林秉炫', '歐梓元', '詩莛', '周襄妮', '陳姮瑞'].sort();
const preAssignedGroups = {
    "吳頔": 0,
    "董世亮": 0,
    "吳與倫": 0,
    "酉璦": 0,
    "苡沁": 0,
    "陳信蓉": 0,
    "陳真泰": 1,
    "晉澤": 1,
    "吳限": 1,
    "張詠晴": 1,
    "陳雨青": 1,
    "尤喜恩": 1,
    "游芷彤": 1,
    "陳信豪": 2,
    "丁康豪": 2,
    "酉謙": 2,
    "陳照希": 2,
    "吳祈悠": 2,
    "尤樂恩": 2,
    "游子琪": 2,
    "陳建榮": 3,
    "林秉炫": 3,
    "歐梓元": 3,
    "詩莛": 3,
    "周襄妮": 3,
    "陳姮瑞": 3
};

// 從 Local Storage 讀取已分組結果
const storedResults = JSON.parse(localStorage.getItem('groupResults')) || {};

// 建立清單結構來保存分組
const groupLists = [
    document.getElementById('group1-list'),
    document.getElementById('group2-list'),
    document.getElementById('group3-list'),
    document.getElementById('group4-list')
];


// 建立按鈕
const namesContainer = document.getElementById('names-container');
names.forEach(name => {
    console.log(name)
    const button = document.createElement('button');
    button.textContent = name;
    button.classList.add('name-button');
    button.id = 'btn_' + name

    // 如果已經有儲存結果，禁用按鈕並顯示已分配的組別
    if (storedResults[name] !== undefined) {
        button.disabled = true;


    }

    button.addEventListener('click', () => startAnimation(name));
    namesContainer.appendChild(button);
});

// 動畫邏輯
function startAnimation(name) {
    const button = document.getElementById(`btn_${name}`);
    button.disabled = true;
    const image = document.getElementById('animation-box');
    image.classList.add('fullscreen')

    let currentImageIndex = 0;
    const imageElement = document.getElementById('group-image');
    imageElement.classList.add('animation-box');
    imageElement.classList.remove('group-image');
    let intervalSpeed = 10; // 開始的動畫速度
    function runAnimation() {

        currentImageIndex = (currentImageIndex + 1) % groups.length;
        imageElement.src = groups[currentImageIndex];


        // 每次遞增間隔速度，使切換逐漸變慢
        intervalSpeed += 10;

        if (intervalSpeed <= 10) {
            // 在速度還沒達到1000毫秒之前，繼續切換
            setTimeout(runAnimation, intervalSpeed);
        } else {
            // 動畫結束，顯示最終結果
            const finalGroup = preAssignedGroups[name]; // 根據預設的分組結果
            imageElement.src = groups[finalGroup];

            // 更新 Local Storage
            storedResults[name] = finalGroup;
            localStorage.setItem('groupResults', JSON.stringify(storedResults));

            // 禁用按鈕，避免重複點擊



            // 將該成員加入對應組別的清單
            const btnID = `btn_${name}_added`;
            const btnMember = createButton(btnID, name, 'name-button', () => { removeFromGroup(btnID, groupLists[finalGroup], name) })
            // const listItem = document.createElement('li');
            // listItem.textContent = name;
            groupLists[finalGroup].appendChild(btnMember)
            calculateMemberCountOfEachGroup();
            function restore() {
                image.classList.remove('fullscreen');
                imageElement.classList.remove('animation-box');
                imageElement.classList.add('group-image');
            };
            setTimeout(restore, 1000)
        }
    }

    // 開始動畫
    runAnimation();
}

function removeFromGroup(id, parent, name) {
    const elm = document.getElementById(id);
    const button = document.getElementById(`btn_${name}`)
    console.log({ elm })
    parent.removeChild(elm);

    button.disabled = false;
    // remove from local stroage
    const groupResult = JSON.parse(localStorage.getItem('groupResults'));
    console.log({ groupResult });
    delete groupResult[name];
    localStorage.setItem('groupResults', JSON.stringify(groupResult))
    calculateMemberCountOfEachGroup();
}


function createButton(id, text, css_classes, clickHandler) {
    const button = document.createElement('button');
    button.textContent = text;
    button.classList.add(css_classes);
    button.id = id

    button.addEventListener('click', clickHandler);
    return button;
}

// 清除 Local Storage 的按鈕
document.getElementById('clear-storage').addEventListener('click', () => {
    localStorage.removeItem('groupResults');
    location.reload(); // 清除後重新整理頁面
});

// 根據 Local Storage 資料，將已經分組的成員放入對應的組別清單
Object.keys(storedResults).forEach(name => {
    const finalGroup = preAssignedGroups[name];
    const btnID = `btn_${name}_added`;
    const btnMember = createButton(btnID, name, 'name-button', () => { removeFromGroup(btnID, groupLists[finalGroup], name) })
    // const listItem = document.createElement('li');
    // listItem.textContent = name;
    groupLists[finalGroup].appendChild(btnMember);
});


function calculateMemberCountOfEachGroup() {
    document.getElementById('countA').innerText = countByGroup(0);
    document.getElementById('countB').innerText = countByGroup(1);
    document.getElementById('countC').innerText = countByGroup(2);
    document.getElementById('countD').innerText = countByGroup(3);

}

function countByGroup(groupID) {
    const groupResult = JSON.parse(localStorage.getItem('groupResults'));
    const names = Object.keys(groupResult);
    let result = 0;
    for (const name of names) {
        const group = groupResult[name];
        if (group === groupID) {
            result += 1;
        }
    }
    return result ;
}

calculateMemberCountOfEachGroup();