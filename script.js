function pasteText() {
  // ใช้ navigator.clipboard.readText() เพื่อดึงข้อความจากคลิปบอร์ด
  navigator.clipboard
    .readText()
    .then(function (clipboardText) {
      var menutextarea = document.getElementById("namemenu");
      menutextarea.value = clipboardText;
      filtermenu();
    })
    .catch(function (err) {
      console.error("Unable to read clipboard text", err);
    });
}

const genmenu = () => {
  let namemenu = document.getElementById("namemenu").value;
  const menuText = `${namemenu}`;
  const regexPattern = /🍲([^🍚]+)🍚/;
  const matches = menuText.match(regexPattern);

  if (matches && matches[1]) {
    const extractedText = matches[1].trim();
    const withoutNumbers = extractedText.replace(/\d+/g, "");

    let menuArray = withoutNumbers.split("\n");
    menuArray = menuArray.map((line) =>
      line
        .replace("ถ้วยละ", "")
        .replace("บาท", "")
        .replace("  ", "")
        .replace(" ", "")
    );

    return menuArray;
  } else {
      alert('ไม่พบข้อมูล! กรุณา Copy ข้อความที่เป็นรายการอาหารทั้งหมด จากกลุ่ม Line Elio');
      document.getElementById('namemenu').value = ''; // เคลียร์ค่าในช่อง input
        return;
  }
};

const filtermenu = () => {
    let i = genmenu();
    const menuContainer = document.getElementById('menuContainer');
    menuContainer.innerHTML = ''; // Clear previous content

    i.forEach(item => {
        // สร้าง element button
        const button = document.createElement('button');
        button.textContent = item;
        button.classList.add('menuButton');

        // เพิ่ม onclick attribute
        button.setAttribute('onclick', `addItem('${item}')`);
 

        // append ลงใน menuContainer
        menuContainer.appendChild(button);

        const plusButton = document.createElement('button');
        plusButton.textContent = '+';
        plusButton.setAttribute('onclick', `increaseQuantity('${item}')`);
        plusButton.classList.add('quantityButton');
        menuContainer.appendChild(plusButton);

        const minusButton = document.createElement('button');
        minusButton.textContent = '-';
        minusButton.setAttribute('onclick', `decreaseQuantity('${item}')`);
        minusButton.classList.add('quantityButton');
        menuContainer.appendChild(minusButton);

        menuContainer.appendChild(document.createElement('br'));
    });

    const copybtn = document.getElementById('copybtn');
    copybtn.style.display = 'block';
    const line = document.getElementById('line');
    line.style.display = 'block';
    const line2 = document.getElementById('line2');
    line2.style.display = 'block';
}

function addItem(item) {
    const showorder = document.getElementById('showorder');
    const listItem = document.createElement('li');
        listItem.textContent = `${item} x 1`;
        showorder.appendChild(listItem);
}

// ฟังก์ชั่นสำหรับเพิ่มจำนวนสินค้า
function increaseQuantity(item) {
    const listItem = findListItem(item);
    let quantity = getQuantity(listItem);
    quantity++;
    listItem.textContent = `${item} x ${quantity}`;
}

// ฟังก์ชั่นสำหรับลดจำนวนสินค้า
function decreaseQuantity(item) {
    const listItem = findListItem(item);
    let quantity = getQuantity(listItem);
    if (quantity > 1) {
        quantity--;
        listItem.textContent = `${item} x ${quantity}`;
    } else {
        // ถ้าเหลือ 1 ชิ้นเท่านั้นให้ลบรายการทั้งหมด
        listItem.remove();
    }
}

// ฟังก์ชั่นที่ช่วยในการค้นหา element ที่มีข้อความที่ตรงกัน
function findListItem(item) {
    const listItems = document.querySelectorAll('#showorder li');
    for (const listItem of listItems) {
        if (listItem.textContent.includes(item)) {
            return listItem;
        }
    }
}

// ฟังก์ชั่นสำหรับดึงค่าจำนวนสินค้า
function getQuantity(listItem) {
    return parseInt(listItem.textContent.split(' ')[2]) || 0;
}

// ฟังก์ชั่นสำหรับคัดลอกข้อมูลอาหาร
function copyOrder() {
    const showorder = document.getElementById('showorder');
    const items = [];
    const roomnumber = document.getElementById('roomnumber').value;
    if (!roomnumber) {
        alert("กรุณากรอกเลขที่ห้อง");
        return;
    }

    items.push(`เลขที่ห้อง: ${roomnumber}\n`);

    for (const listItem of showorder.children) {
        const item = listItem.textContent.trim();
        items.push(item);
    }
    const orderText = items.join('\n');
    
    // คัดลอกข้อความไปยัง Clipboard
    navigator.clipboard.writeText(orderText)
        .then(() => alert('รายการอาหารของคุณถูก Copy แล้ว!'))
        .catch(err => console.error('Unable to copy order', err));
}

// Start Function Input Number Only
function validateAndCleanInput() {
    const roomnumber = document.getElementById('roomnumber');
    let inputValue = roomnumber.value;
  
    // ใช้ Regular Expression ในการตรวจสอบค่าที่กรอกเข้ามา
    const regex = /^[0-9]+$/;
  
    if (!regex.test(inputValue)) {
      // ถ้าค่าไม่ใช่ตัวเลข 0-9 ให้ลบข้อมูลทิ้ง
      inputValue = inputValue.replace(/[^0-9]/g, '');
      roomnumber.value = inputValue;
    }
  }
// End Function Input Number Only