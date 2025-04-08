document.addEventListener('DOMContentLoaded', () => {
    // 獲取 DOM 元素
    const minValSlider = document.getElementById('min-val');
    const maxValSlider = document.getElementById('max-val');
    const intervalSlider = document.getElementById('interval-slider');
    const minValDisplay = document.getElementById('min-val-display');
    const maxValDisplay = document.getElementById('max-val-display');
    const intervalDisplay = document.getElementById('interval-display');
    const randomNumberDisplay = document.getElementById('random-number-display');
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const statusMessage = document.getElementById('status-message');

    let intervalId = null; // 用於儲存 setInterval 的 ID
    let currentInterval = parseInt(intervalSlider.value, 10);

    // --- Helper 函數 ---
    // 產生指定範圍內的亂數整數 (現在直接讀 slider value)
    function getRandomInt(min, max) {
        // Slider 會確保是數字，但還是轉一下以防萬一
        min = parseInt(min, 10);
        max = parseInt(max, 10);

        // 不需要向上/向下取整，因為 slider 的 step=1
        // min = Math.ceil(min);
        // max = Math.floor(max);

        // **重要：** 確保 min 不大於 max，如果發生，直接返回 min（或 max）
        // 更好的處理在事件監聽器中完成
        if (min > max) {
            // 理論上 slider 的事件監聽會防止這種情況持續存在
            // 但作為最後防線，返回其中一個值
             console.warn("最小值大於最大值，返回最小值");
            return min; // 或者返回 max
        }
        if (min === max) {
            return min;
        }
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // 更新亂數顯示
    function updateRandomNumber() {
        const minVal = minValSlider.value; // 直接從 slider 取值 (string)
        const maxVal = maxValSlider.value; // 直接從 slider 取值 (string)

        // Slider 保證了值是數字且在範圍內，基本驗證可簡化
        statusMessage.textContent = ''; // 清除舊訊息
        randomNumberDisplay.textContent = getRandomInt(minVal, maxVal);
         randomNumberDisplay.style.backgroundColor = '#e9ecef'; // 重置背景色
         // 短暫改變背景色提示更新
         setTimeout(() => {
            randomNumberDisplay.style.backgroundColor = '#d0eaff'; // 亮一點的藍色
         }, 0);
          setTimeout(() => {
            randomNumberDisplay.style.backgroundColor = '#e9ecef'; // 恢復原色
         }, 150); // 比更新間隔短
    }

    // --- 控制函數 ---
    function startGenerator() {
        stopGenerator(); // 先停止任何可能正在運行的計時器

        currentInterval = parseInt(intervalSlider.value, 10);
        const minVal = parseInt(minValSlider.value, 10);
        const maxVal = parseInt(maxValSlider.value, 10);

        // 確保 min <= max (雖然 slider 事件會處理，但啟動時再檢查一次)
        if (minVal > maxVal) {
             statusMessage.textContent = '錯誤：最小值不能大於最大值！';
             randomNumberDisplay.textContent = '錯誤';
             return; // 不啟動
        }

        statusMessage.textContent = '產生器運行中...';
        updateRandomNumber(); // 立刻顯示第一個數字
        intervalId = setInterval(updateRandomNumber, currentInterval);

        // 更新按鈕狀態並禁用所有 Slider
        startBtn.disabled = true;
        stopBtn.disabled = false;
        minValSlider.disabled = true;
        maxValSlider.disabled = true;
        intervalSlider.disabled = true;
    }

    function stopGenerator() {
        if (intervalId !== null) {
            clearInterval(intervalId);
            intervalId = null;
        }
        startBtn.disabled = false;
        stopBtn.disabled = true;
        // 重新啟用 Slider
        minValSlider.disabled = false;
        maxValSlider.disabled = false;
        intervalSlider.disabled = false;

        if (randomNumberDisplay.textContent !== '錯誤' && randomNumberDisplay.textContent !== '--') {
            statusMessage.textContent = '產生器已停止。';
        } else if (randomNumberDisplay.textContent !== '錯誤') {
             statusMessage.textContent = '請設定範圍和間隔，然後點擊開始。';
        }
         randomNumberDisplay.style.backgroundColor = '#e9ecef'; // 恢復預設背景色
    }

    // --- 事件監聽器 ---

    // 最小值 Slider
    minValSlider.addEventListener('input', () => {
        const minValue = parseInt(minValSlider.value, 10);
        const maxValue = parseInt(maxValSlider.value, 10);
        minValDisplay.textContent = minValue;

        // **重要：** 防止最小值超過最大值
        if (minValue > maxValue) {
            maxValSlider.value = minValue; // 將最大值提升到等於最小值
            maxValDisplay.textContent = minValue; // 更新最大值顯示
        }
        // 如果正在運行，是否需要重啟？(保持與 interval 一致，重啟)
        if (intervalId !== null) {
             startGenerator();
        }
    });

    // 最大值 Slider
    maxValSlider.addEventListener('input', () => {
        const minValue = parseInt(minValSlider.value, 10);
        const maxValue = parseInt(maxValSlider.value, 10);
        maxValDisplay.textContent = maxValue;

        // **重要：** 防止最大值低於最小值
        if (maxValue < minValue) {
            minValSlider.value = maxValue; // 將最小值降低到等於最大值
            minValDisplay.textContent = maxValue; // 更新最小值顯示
        }
         // 如果正在運行，重啟
        if (intervalId !== null) {
             startGenerator();
        }
    });

    // 更新間隔 Slider
    intervalSlider.addEventListener('input', () => {
        currentInterval = parseInt(intervalSlider.value, 10);
        intervalDisplay.textContent = currentInterval;
        // 如果產生器正在運行，則立刻應用新的間隔 (透過重啟)
        if (intervalId !== null) {
            startGenerator();
        }
    });

    // 開始按鈕
    startBtn.addEventListener('click', startGenerator);

    // 停止按鈕
    stopBtn.addEventListener('click', stopGenerator);

    // --- 初始化 ---
    // 頁面載入時，設定顯示的初始值
    minValDisplay.textContent = minValSlider.value;
    maxValDisplay.textContent = maxValSlider.value;
    intervalDisplay.textContent = intervalSlider.value;
    statusMessage.textContent = '請設定範圍和間隔，然後點擊開始。';
});