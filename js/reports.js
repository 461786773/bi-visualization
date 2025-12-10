// 报表配置逻辑 - 优化版本
class ReportsManager {
    constructor() {
        // 延迟初始化，避免阻塞页面渲染
        this.reports = [];
        this.dataCards = [];
        this.dimensions = [];
        this.dataSources = [];
        this.isInitialized = false;
        
        // 异步初始化，提高页面响应速度
        this.initAsync();
    }
    
    // 异步初始化
    async initAsync() {
        // 等待dataConfig加载完成
        await this.waitForDataConfig();
        
        // 按需加载数据，避免重复读取
        this.reports = this.loadReportsFromConfig();
        this.dataCards = this.loadDataCardsFromConfig();
        this.dimensions = this.loadDimensionsFromConfig();
        this.dataSources = window.DataConfig?.dataSources || [];
        
        this.isInitialized = true;
        this.init();
        
        console.log('报表管理器异步初始化完成');
    }
    
    // 等待dataConfig加载完成
    waitForDataConfig() {
        return new Promise((resolve) => {
            if (window.DataConfig) {
                resolve();
            } else {
                const checkInterval = setInterval(() => {
                    if (window.DataConfig) {
                        clearInterval(checkInterval);
                        resolve();
                    }
                }, 10);
            }
        });
    }
    
    // 从dataConfig中加载报表
    loadReportsFromConfig() {
        return window.DataConfig?.reports || [];
    }
    
    // 从dataConfig中加载数据卡片
    loadDataCardsFromConfig() {
        return window.DataConfig?.dataCards || [];
    }
    
    // 从dataConfig中加载维度
    loadDimensionsFromConfig() {
        return window.DataConfig?.dimensions || [];
    }

    init() {
        // 延迟初始化以确保依赖项已加载
        setTimeout(() => {
            this.loadReports();
            this.loadDataCards();
            this.setupEventListeners();
            
            // 确保演示数据正确加载
            console.log('报表管理器初始化完成');
            console.log('报表数量：', this.reports.length);
            console.log('数据卡片数量：', this.dataCards.length);
            console.log('数据源数量：', this.dataSources.length);
            console.log('维度数量：', this.dimensions.length);
            
            // 如果报表为空，尝试创建示例报表
            if (this.reports.length === 0 && this.dataCards.length > 0) {
                this.createSampleReport();
            }
        }, 100);
    }

    setupEventListeners() {
        // 报表类型切换
        document.getElementById('reportType').addEventListener('change', () => this.toggleReportConfig());
        
        // 时间范围类型切换
        document.getElementById('timeRangeType').addEventListener('change', () => this.toggleTimeRange());
        
        // 自动刷新切换
        document.querySelectorAll('input[name="autoRefresh"]').forEach(radio => {
            radio.addEventListener('change', () => this.toggleRefreshInterval());
        });
        
        // 布局模板切换
        document.getElementById('layoutTemplate').addEventListener('change', () => this.updateLayout());
        
        // 模态框关闭按钮
        const closeBtn = document.getElementById('closeReportModalBtn');
        const cancelBtn = document.getElementById('cancelReportBtn');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeReportModal());
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.closeReportModal());
        }
        
        // 点击模态框背景关闭
        const modal = document.getElementById('reportModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeReportModal();
                }
            });
        }
    }

    loadDataCards() {
        const dataCardsSelection = document.getElementById('dataCardsSelection');
        
        // 清空选择区域
        dataCardsSelection.innerHTML = '';

        if (this.dataCards.length === 0) {
            dataCardsSelection.innerHTML = '<p style="color: #999; text-align: center;">暂无数据卡片，请先创建数据卡片</p>';
            return;
        }

        // 创建数据卡片选择列表
        this.dataCards.forEach((card) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'data-card-item';
            cardElement.innerHTML = `
                <label style="display: flex; align-items: center; gap: 10px; padding: 10px; border: 1px solid #e8e8e8; border-radius: 4px; margin-bottom: 10px;">
                    <input type="checkbox" value="${card.id}" onchange="reportsManager.updateLayout()">
                    <span>${card.name}</span>
                    <span style="color: #999; font-size: 12px;">(${this.getCardTypeText(card.type)})</span>
                </label>
            `;
            dataCardsSelection.appendChild(cardElement);
        });
    }

    getCardTypeText(cardType) {
        const typeMap = {
            'kpi': 'KPI指标卡',
            'line': '折线图',
            'bar': '柱状图',
            'pie': '饼图',
            'table': '数据表格',
            'map': '地图'
        };
        return typeMap[cardType] || cardType;
    }

    toggleReportConfig() {
        // 可以根据报表类型显示不同的配置选项
        // 这里可以添加特定类型的配置逻辑
    }

    toggleTimeRange() {
        const timeRangeType = document.getElementById('timeRangeType').value;
        const relativeRange = document.getElementById('relativeTimeRange');
        const absoluteRange = document.getElementById('absoluteTimeRange');
        
        if (timeRangeType === 'relative') {
            relativeRange.style.display = 'block';
            absoluteRange.style.display = 'none';
        } else {
            relativeRange.style.display = 'none';
            absoluteRange.style.display = 'block';
        }
    }

    toggleRefreshInterval() {
        const autoRefresh = document.querySelector('input[name="autoRefresh"]:checked').value;
        const refreshInterval = document.getElementById('refreshInterval');
        
        if (autoRefresh === 'on') {
            refreshInterval.style.display = 'block';
        } else {
            refreshInterval.style.display = 'none';
        }
    }

    updateLayout() {
        const layoutPreview = document.getElementById('layoutPreview');
        const layoutTemplate = document.getElementById('layoutTemplate').value;
        
        // 获取选中的数据卡片
        const selectedCards = Array.from(document.querySelectorAll('#dataCardsSelection input[type="checkbox"]:checked'))
            .map(cb => this.dataCards.find(card => card.id == cb.value))
            .filter(Boolean);

        if (selectedCards.length === 0) {
            layoutPreview.innerHTML = '<p style="color: #999; text-align: center;">请选择数据卡片</p>';
            return;
        }

        let layoutHTML = '';
        
        if (layoutTemplate === 'custom') {
            // 自定义布局：支持拖拽和大小调整
            layoutHTML = `
                <div class="drag-layout-container">
                    <div class="layout-help">
                        <span class="help-icon">💡</span>
                        <strong>使用提示：</strong>拖拽卡片右上角手柄可调整位置，点击卡片右下角按钮可调整大小
                    </div>
                    <div class="drag-grid" id="dragGrid">
                        ${selectedCards.map((card, index) => `
                            <div class="draggable-card" draggable="true" data-card-id="${card.id}" data-index="${index}" data-card-size="normal">
                                <div class="drag-handle">⋮⋮</div>
                                <div style="font-size: 24px;">${this.getCardIcon(card.type)}</div>
                                <div style="font-size: 12px; margin-top: 5px;">${card.name}</div>
                                <div style="font-size: 10px; color: #999;">${this.getCardTypeText(card.type)}</div>
                                <div class="card-actions">
                                    <button class="btn-tiny" onclick="reportsManager.setCardSize(this.parentElement.parentElement, 'full')" title="全宽">▣</button>
                                    <button class="btn-tiny" onclick="reportsManager.setCardSize(this.parentElement.parentElement, 'half')" title="半宽">▦</button>
                                    <button class="btn-tiny" onclick="reportsManager.setCardSize(this.parentElement.parentElement, 'normal')" title="正常">□</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="layout-actions">
                        <button class="btn-small" onclick="reportsManager.resetLayout()">重置布局</button>
                        <button class="btn-small" onclick="reportsManager.autoArrangeLayout()">自动排列</button>
                        <button class="btn-small" onclick="reportsManager.saveCustomLayout()">保存布局</button>
                    </div>
                </div>
            `;
        } else if (layoutTemplate === 'grid') {
            layoutHTML = `
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
                    ${selectedCards.map(card => `
                        <div style="background: #f0f0f0; padding: 20px; border-radius: 4px; text-align: center;">
                            <div style="font-size: 24px;">${this.getCardIcon(card.type)}</div>
                            <div style="font-size: 12px; margin-top: 5px;">${card.name}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        } else if (layoutTemplate === 'column') {
            layoutHTML = `
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    ${selectedCards.map(card => `
                        <div style="background: #f0f0f0; padding: 20px; border-radius: 4px; text-align: center;">
                            <div style="font-size: 24px;">${this.getCardIcon(card.type)}</div>
                            <div style="font-size: 12px; margin-top: 5px;">${card.name}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        } else if (layoutTemplate === 'row') {
            layoutHTML = `
                <div style="display: flex; gap: 10px; overflow-x: auto;">
                    ${selectedCards.map(card => `
                        <div style="background: #f0f0f0; padding: 20px; border-radius: 4px; text-align: center; min-width: 150px;">
                            <div style="font-size: 24px;">${this.getCardIcon(card.type)}</div>
                            <div style="font-size: 12px; margin-top: 5px;">${card.name}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        layoutPreview.innerHTML = layoutHTML;
        
        // 如果是自定义布局，初始化拖拽功能
        if (layoutTemplate === 'custom') {
            this.initDragAndDrop();
        }
    }

    // 初始化拖拽功能（支持上下左右拖拽）
    initDragAndDrop() {
        const draggableCards = document.querySelectorAll('.draggable-card');
        const dragGrid = document.getElementById('dragGrid');
        
        let draggedCard = null;
        let dragOffsetX = 0;
        let dragOffsetY = 0;
        
        // 初始化网格布局
        this.initGridLayout(dragGrid, draggableCards.length);
        
        draggableCards.forEach(card => {
            // 开始拖拽
            card.addEventListener('dragstart', (e) => {
                draggedCard = card;
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/html', card.innerHTML);
                
                // 记录原始位置
                originalPosition = {
                    x: card.offsetLeft,
                    y: card.offsetTop,
                    gridColumn: card.style.gridColumn,
                    gridRow: card.style.gridRow
                };
                
                // 计算拖拽偏移量
                const rect = card.getBoundingClientRect();
                dragOffsetX = e.clientX - rect.left;
                dragOffsetY = e.clientY - rect.top;
                
                setTimeout(() => {
                    card.style.opacity = '0.4';
                    card.style.position = 'fixed';
                    card.style.zIndex = '1000';
                    card.style.pointerEvents = 'none';
                }, 0);
            });
            
            // 拖拽中
            document.addEventListener('dragover', (e) => {
                if (!draggedCard) return;
                
                // 更新拖拽卡片位置
                draggedCard.style.left = (e.clientX - dragOffsetX) + 'px';
                draggedCard.style.top = (e.clientY - dragOffsetY) + 'px';
                
                // 显示放置位置指示器
                this.showDropIndicator(e, draggedCard, dragGrid);
            });
            
            // 拖拽结束
            card.addEventListener('dragend', () => {
                if (draggedCard) {
                    draggedCard.style.opacity = '1';
                    draggedCard.style.position = '';
                    draggedCard.style.zIndex = '';
                    draggedCard.style.pointerEvents = '';
                    draggedCard.style.left = '';
                    draggedCard.style.top = '';
                    
                    // 移除所有拖拽指示器
                    this.removeDropIndicators(dragGrid);
                }
                
                draggableCards.forEach(c => c.classList.remove('drag-over'));
                draggedCard = null;
            });
            
            // 拖拽经过
            card.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            });
            
            // 拖拽进入
            card.addEventListener('dragenter', (e) => {
                e.preventDefault();
                if (card !== draggedCard) {
                    card.classList.add('drag-over');
                }
            });
            
            // 拖拽离开
            card.addEventListener('dragleave', () => {
                card.classList.remove('drag-over');
            });
            
            // 放置
            card.addEventListener('drop', (e) => {
                e.preventDefault();
                card.classList.remove('drag-over');
                
                if (card !== draggedCard) {
                    // 获取目标位置
                    const targetRect = card.getBoundingClientRect();
                    
                    // 判断放置方向（上下左右）
                    const dropDirection = this.getDropDirection(e.clientX, e.clientY, targetRect);
                    
                    // 根据方向执行不同的放置逻辑
                    this.handleDrop(draggedCard, card, dragGrid, dropDirection);
                    
                    // 更新布局顺序
                    this.updateCardOrder();
                }
                
                // 移除所有拖拽指示器
                this.removeDropIndicators(dragGrid);
            });
        });
    }
    
    // 初始化网格布局
    initGridLayout(grid, cardCount) {
        // 根据卡片数量自动调整网格布局
        const columns = Math.ceil(Math.sqrt(cardCount));
        grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
        
        // 为每个卡片设置初始网格位置
        const cards = Array.from(grid.children);
        cards.forEach((card, index) => {
            const row = Math.floor(index / columns) + 1;
            const col = (index % columns) + 1;
            card.style.gridColumn = col;
            card.style.gridRow = row;
        });
    }
    
    // 显示放置位置指示器
    showDropIndicator(e, draggedCard, grid) {
        // 移除现有指示器
        this.removeDropIndicators(grid);
        
        const elements = document.elementsFromPoint(e.clientX, e.clientY);
        const targetCard = elements.find(el => el.classList.contains('draggable-card') && el !== draggedCard);
        
        if (targetCard) {
            const rect = targetCard.getBoundingClientRect();
            const dropDirection = this.getDropDirection(e.clientX, e.clientY, rect);
            
            // 创建放置指示器
            const indicator = document.createElement('div');
            indicator.className = 'drop-indicator ' + dropDirection;
            
            // 根据方向设置指示器位置
            switch(dropDirection) {
                case 'left':
                    indicator.style.left = rect.left + 'px';
                    indicator.style.top = rect.top + 'px';
                    indicator.style.width = '4px';
                    indicator.style.height = rect.height + 'px';
                    break;
                case 'right':
                    indicator.style.left = (rect.left + rect.width) + 'px';
                    indicator.style.top = rect.top + 'px';
                    indicator.style.width = '4px';
                    indicator.style.height = rect.height + 'px';
                    break;
                case 'top':
                    indicator.style.left = rect.left + 'px';
                    indicator.style.top = rect.top + 'px';
                    indicator.style.width = rect.width + 'px';
                    indicator.style.height = '4px';
                    break;
                case 'bottom':
                    indicator.style.left = rect.left + 'px';
                    indicator.style.top = (rect.top + rect.height) + 'px';
                    indicator.style.width = rect.width + 'px';
                    indicator.style.height = '4px';
                    break;
            }
            
            document.body.appendChild(indicator);
        }
    }
    
    // 移除所有放置指示器
    removeDropIndicators() {
        const indicators = document.querySelectorAll('.drop-indicator');
        indicators.forEach(indicator => indicator.remove());
    }
    
    // 获取放置方向
    getDropDirection(x, y, targetRect) {
        const centerX = targetRect.left + targetRect.width / 2;
        const centerY = targetRect.top + targetRect.height / 2;
        
        const horizontalDistance = Math.abs(x - centerX);
        const verticalDistance = Math.abs(y - centerY);
        
        // 判断是水平放置还是垂直放置
        if (horizontalDistance / targetRect.width > verticalDistance / targetRect.height) {
            // 水平放置
            return x < centerX ? 'left' : 'right';
        } else {
            // 垂直放置
            return y < centerY ? 'top' : 'bottom';
        }
    }
    
    // 处理放置操作
    handleDrop(draggedCard, targetCard, grid, direction) {
        const allCards = Array.from(grid.children);
        const targetIndex = allCards.indexOf(targetCard);
        
        switch(direction) {
            case 'left':
                // 插入到目标左侧
                grid.insertBefore(draggedCard, targetCard);
                break;
            case 'right':
                // 插入到目标右侧
                if (targetIndex < allCards.length - 1) {
                    grid.insertBefore(draggedCard, targetCard.nextSibling);
                } else {
                    grid.appendChild(draggedCard);
                }
                break;
            case 'top':
                // 插入到目标上方
                grid.insertBefore(draggedCard, targetCard);
                break;
            case 'bottom':
                // 插入到目标下方
                if (targetIndex < allCards.length - 1) {
                    grid.insertBefore(draggedCard, targetCard.nextSibling);
                } else {
                    grid.appendChild(draggedCard);
                }
                break;
        }
        
        // 更新网格布局
        this.updateGridLayout(grid);
    }
    
    // 更新网格布局
    updateGridLayout(grid) {
        const cards = Array.from(grid.children);
        const columns = parseInt(getComputedStyle(grid).gridTemplateColumns.split(' ').length);
        
        cards.forEach((card, index) => {
            const row = Math.floor(index / columns) + 1;
            const col = (index % columns) + 1;
            card.style.gridColumn = col;
            card.style.gridRow = row;
        });
    }
    
    // 设置卡片大小
    setCardSize(card, size) {
        card.setAttribute('data-card-size', size);
        
        // 根据大小设置样式
        const grid = document.getElementById('dragGrid');
        if (!grid) return;
        
        switch(size) {
            case 'full':
                card.style.gridColumn = '1 / -1'; // 横向填满
                card.style.gridRow = 'auto';
                break;
            case 'half':
                card.style.gridColumn = 'span 2'; // 占用2列
                card.style.gridRow = 'auto';
                break;
            case 'normal':
                card.style.gridColumn = 'auto';
                card.style.gridRow = 'auto';
                break;
        }
        
        // 重新排列其他卡片
        this.autoArrangeLayout();
    }
    
    // 自动排列布局
    autoArrangeLayout() {
        const grid = document.getElementById('dragGrid');
        if (!grid) return;
        
        const cards = Array.from(grid.children);
        if (cards.length === 0) return;
        
        // 重置所有卡片位置
        cards.forEach(card => {
            card.style.gridColumn = 'auto';
            card.style.gridRow = 'auto';
        });
        
        // 智能排列算法
        this.smartArrangeCards(cards, grid);
    }
    
    // 智能排列卡片
    smartArrangeCards(cards, grid) {
        const maxColumns = 4; // 最大列数
        let currentRow = 1;
        let currentCol = 1;
        
        cards.forEach(card => {
            const size = card.getAttribute('data-card-size') || 'normal';
            let span = 1;
            
            // 根据卡片大小确定跨度
            switch(size) {
                case 'full':
                    span = maxColumns;
                    break;
                case 'half':
                    span = 2;
                    break;
                case 'normal':
                    span = 1;
                    break;
            }
            
            // 检查当前行是否有足够空间
            if (currentCol + span - 1 > maxColumns) {
                // 换行
                currentRow++;
                currentCol = 1;
            }
            
            // 设置卡片位置
            card.style.gridColumn = `${currentCol} / span ${span}`;
            card.style.gridRow = currentRow;
            
            // 更新列位置
            currentCol += span;
            
            // 如果当前行已满，换行
            if (currentCol > maxColumns) {
                currentRow++;
                currentCol = 1;
            }
        });
        
        // 更新网格模板
        grid.style.gridTemplateColumns = `repeat(${maxColumns}, 1fr)`;
    }
    
    // 初始化网格布局（支持智能排列）
    initGridLayout(grid, cardCount) {
        const cards = Array.from(grid.children);
        
        // 如果有全宽卡片，使用智能排列
        const hasFullWidth = Array.from(cards).some(card => 
            card.getAttribute('data-card-size') === 'full'
        );
        
        if (hasFullWidth) {
            this.smartArrangeCards(cards, grid);
        } else {
            // 默认网格布局
            const columns = Math.ceil(Math.sqrt(cardCount));
            grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
            
            cards.forEach((card, index) => {
                const row = Math.floor(index / columns) + 1;
                const col = (index % columns) + 1;
                card.style.gridColumn = col;
                card.style.gridRow = row;
            });
        }
    }
    
    // 更新卡片顺序
    updateCardOrder() {
        const dragGrid = document.getElementById('dragGrid');
        if (!dragGrid) return;
        
        const cards = Array.from(dragGrid.children);
        const cardOrder = cards.map(card => parseInt(card.getAttribute('data-card-id')));
        
        // 保存当前布局顺序
        this.currentLayoutOrder = cardOrder;
    }
    
    // 重置布局
    resetLayout() {
        const dragGrid = document.getElementById('dragGrid');
        if (!dragGrid) return;
        
        // 获取原始顺序（按选择顺序）
        const selectedCards = Array.from(document.querySelectorAll('#dataCardsSelection input[type="checkbox"]:checked'))
            .map(cb => this.dataCards.find(card => card.id == cb.value))
            .filter(Boolean);
        
        const originalOrder = selectedCards.map(card => card.id);
        
        // 重新排序
        const cards = Array.from(dragGrid.children);
        cards.sort((a, b) => {
            const aId = parseInt(a.getAttribute('data-card-id'));
            const bId = parseInt(b.getAttribute('data-card-id'));
            return originalOrder.indexOf(aId) - originalOrder.indexOf(bId);
        });
        
        // 清空并重新添加
        cards.forEach(card => dragGrid.appendChild(card));
        
        this.updateCardOrder();
    }
    
    // 保存自定义布局
    saveCustomLayout() {
        if (this.currentLayoutOrder) {
            alert('自定义布局已保存！');
            // 这里可以保存到报表配置中
        }
    }

    getCardIcon(type) {
        const iconMap = {
            'kpi': '📈',
            'line': '📉',
            'bar': '📊',
            'pie': '🥧',
            'table': '📋',
            'map': '🗺️'
        };
        return iconMap[type] || '📄';
    }

    addFilter() {
        const filterConditions = document.getElementById('filterConditions');
        
        // 检查是否有维度数据
        if (this.dimensions.length === 0) {
            alert('暂无维度数据，请先创建维度');
            return;
        }
        
        const newFilter = document.createElement('div');
        newFilter.className = 'filter-condition';
        newFilter.innerHTML = `
            <select class="filter-dimension">
                <option value="">选择维度</option>
                ${this.dimensions.map(dim => {
                    // 确保维度数据完整性
                    if (dim && dim.id && dim.displayName) {
                        return `<option value="${dim.id}">${dim.displayName}</option>`;
                    }
                    return '';
                }).join('')}
            </select>
            <select class="filter-operator">
                <option value="=">等于</option>
                <option value="!=">不等于</option>
                <option value=">">大于</option>
                <option value="<">小于</option>
                <option value=">=">大于等于</option>
                <option value="<=">小于等于</option>
            </select>
            <input type="text" class="filter-value" placeholder="筛选值">
            <button class="btn-small danger" onclick="removeFilter(this)">删除</button>
        `;
        filterConditions.appendChild(newFilter);
        
        // 调试信息
        console.log('添加筛选条件，可用维度数量:', this.dimensions.length);
    }

    removeFilter(button) {
        button.parentElement.remove();
    }

    selectReportTemplate(templateType) {
        document.getElementById('reportModalTitle').textContent = `创建${this.getTemplateName(templateType)}`;
        this.resetForm();
        
        // 设置默认类型
        document.getElementById('reportType').value = templateType;
        
        // 预填充模板配置
        if (templateType === 'dashboard') {
            document.getElementById('layoutTemplate').value = 'grid';
        } else if (templateType === 'summary') {
            document.getElementById('layoutTemplate').value = 'column';
        } else if (templateType === 'detail') {
            document.getElementById('layoutTemplate').value = 'column';
        } else if (templateType === 'comparison') {
            document.getElementById('layoutTemplate').value = 'row';
        }
        
        this.toggleReportConfig();
        this.updateLayout();
        document.getElementById('reportModal').classList.add('show');
    }

    getTemplateName(type) {
        const nameMap = {
            'dashboard': '仪表盘',
            'summary': '汇总报表',
            'detail': '明细报表',
            'comparison': '对比报表'
        };
        return nameMap[type] || type;
    }

    loadReports() {
        const myReports = document.getElementById('myReports');
        
        if (this.reports.length === 0) {
            myReports.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #999;">
                    <div style="font-size: 48px; margin-bottom: 10px;">📊</div>
                    <p style="font-size: 16px; margin-bottom: 10px;">暂无报表</p>
                    <p style="font-size: 14px; color: #666;">从模板开始创建或点击"创建报表"</p>
                </div>
            `;
            return;
        }

        myReports.innerHTML = this.reports.map((report, index) => {
            const cardCount = report.dataCardIds ? report.dataCardIds.length : 0;
            
            const iconMap = {
                'dashboard': '📊',
                'summary': '📈',
                'detail': '📋',
                'comparison': '⚖️'
            };

            return `
                <div class="card">
                    <div class="card-title">
                        <span style="font-size: 20px;">${iconMap[report.type]}</span>
                        <span>${report.name}</span>
                    </div>
                    <div class="card-content">
                        <p><strong>类型：</strong>${this.getTemplateName(report.type)}</p>
                        <p><strong>包含卡片：</strong>${cardCount}个</p>
                        <p><strong>创建时间：</strong>${new Date(report.createdAt).toLocaleDateString()}</p>
                        <p><strong>描述：</strong>${report.description || '无描述'}</p>
                    </div>
                    <div class="card-actions">
                        <button class="card-action-btn primary" onclick="reportsManager.previewReport(${index})">📊 预览</button>
                        <button class="card-action-btn" onclick="reportsManager.editReport(${index})">✏️ 编辑</button>
                        <button class="card-action-btn danger" onclick="reportsManager.deleteReport(${index})">🗑️ 删除</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    refreshReports() {
        this.loadReports();
        alert('报表列表已刷新');
    }

    showCreateReportModal() {
        document.getElementById('reportModalTitle').textContent = '创建报表';
        this.resetForm();
        document.getElementById('reportModal').classList.add('show');
    }

    editReport(index) {
        const report = this.reports[index];
        document.getElementById('reportModalTitle').textContent = '编辑报表';
        
        // 填充表单数据
        document.getElementById('reportName').value = report.name;
        document.getElementById('reportType').value = report.type;
        document.getElementById('reportDescription').value = report.description || '';
        
        // 设置数据卡片选择
        if (report.dataCardIds) {
            report.dataCardIds.forEach(cardId => {
                const checkbox = document.querySelector(`#dataCardsSelection input[value="${cardId}"]`);
                if (checkbox) checkbox.checked = true;
            });
        }
        
        // 设置布局
        document.getElementById('layoutTemplate').value = report.config?.layout || 'grid';
        
        // 设置筛选条件（简化处理）
        // 设置时间范围
        if (report.config?.timeRange) {
            document.getElementById('timeRangeType').value = report.config.timeRange.type || 'relative';
            if (report.config.timeRange.type === 'relative') {
                document.getElementById('relativeTimeUnit').value = report.config.timeRange.unit || 'this_month';
            } else {
                document.getElementById('startDate').value = report.config.timeRange.start || '';
                document.getElementById('endDate').value = report.config.timeRange.end || '';
            }
        }
        
        // 设置自动刷新
        if (report.config?.autoRefresh) {
            document.querySelector('input[name="autoRefresh"][value="on"]').checked = true;
            document.getElementById('refreshTime').value = report.config.refreshInterval || 5;
        }

        // 保存当前编辑的索引
        this.currentEditIndex = index;
        
        this.toggleTimeRange();
        this.toggleRefreshInterval();
        this.updateLayout();
        document.getElementById('reportModal').classList.add('show');
    }

    resetForm() {
        document.getElementById('reportName').value = '';
        document.getElementById('reportType').value = 'dashboard';
        document.getElementById('reportDescription').value = '';
        
        // 重置数据卡片选择
        document.querySelectorAll('#dataCardsSelection input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });
        
        // 重置布局
        document.getElementById('layoutTemplate').value = 'grid';
        
        // 重置筛选条件
        const filterConditions = document.getElementById('filterConditions');
        while (filterConditions.children.length > 1) {
            filterConditions.removeChild(filterConditions.lastChild);
        }
        
        // 重置时间范围
        document.getElementById('timeRangeType').value = 'relative';
        document.getElementById('relativeTimeUnit').value = 'this_month';
        document.getElementById('startDate').value = '';
        document.getElementById('endDate').value = '';
        
        // 重置自动刷新
        document.querySelector('input[name="autoRefresh"][value="off"]').checked = true;
        document.getElementById('refreshTime').value = 5;
        
        this.currentEditIndex = null;
        this.toggleTimeRange();
        this.toggleRefreshInterval();
        this.updateLayout();
    }

    saveReport() {
        const name = document.getElementById('reportName').value.trim();
        const type = document.getElementById('reportType').value;
        const description = document.getElementById('reportDescription').value.trim();
        
        if (!name) {
            alert('请输入报表名称');
            return;
        }

        // 获取选中的数据卡片
        const dataCardIds = Array.from(document.querySelectorAll('#dataCardsSelection input[type="checkbox"]:checked'))
            .map(cb => parseInt(cb.value));

        if (dataCardIds.length === 0) {
            alert('请至少选择一个数据卡片');
            return;
        }

        const config = {
            layout: document.getElementById('layoutTemplate').value,
            timeRange: {},
            autoRefresh: {}
        };

        // 时间范围配置
        const timeRangeType = document.getElementById('timeRangeType').value;
        if (timeRangeType === 'relative') {
            config.timeRange = {
                type: 'relative',
                unit: document.getElementById('relativeTimeUnit').value
            };
        } else {
            config.timeRange = {
                type: 'absolute',
                start: document.getElementById('startDate').value,
                end: document.getElementById('endDate').value
            };
        }

        // 自动刷新配置
        const autoRefresh = document.querySelector('input[name="autoRefresh"]:checked').value;
        if (autoRefresh === 'on') {
            config.autoRefresh = {
                enabled: true,
                interval: parseInt(document.getElementById('refreshTime').value)
            };
        }

        // 筛选条件配置（简化处理）
        const filters = [];
        document.querySelectorAll('.filter-condition').forEach(condition => {
            const dimension = condition.querySelector('.filter-dimension').value;
            const operator = condition.querySelector('.filter-operator').value;
            const value = condition.querySelector('.filter-value').value;
            
            if (dimension && value) {
                filters.push({ dimension, operator, value });
            }
        });
        config.filters = filters;

        const report = {
            id: this.currentEditIndex !== null ? this.reports[this.currentEditIndex].id : Date.now(),
            name,
            type,
            dataCardIds,
            config,
            description,
            createdAt: this.currentEditIndex !== null ? this.reports[this.currentEditIndex].createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (this.currentEditIndex !== null) {
            // 更新现有报表
            this.reports[this.currentEditIndex] = report;
        } else {
            // 添加新报表
            this.reports.push(report);
        }

        this.loadReports();
        this.closeReportModal();
        
        alert(this.currentEditIndex !== null ? '报表更新成功' : '报表创建成功');
    }

    deleteReport(index) {
        if (confirm('确定要删除这个报表吗？')) {
            this.reports.splice(index, 1);
            this.loadReports();
            alert('报表删除成功');
        }
    }

    previewReport(index) {
        const report = this.reports[index];
        
        // 检查报表预览模态框是否存在
        const previewModal = document.getElementById('reportPreviewModal');
        if (!previewModal) {
            alert('报表预览功能暂不可用，请检查页面结构');
            return;
        }
        
        document.getElementById('reportPreviewTitle').textContent = `报表预览 - ${report.name}`;
        
        let previewContent = `
            <div class="preview-header">
                <h3 style="margin: 0 0 10px 0; color: #333;">${report.name}</h3>
                <p style="margin: 0; color: #666;">${report.description || '暂无描述'}</p>
                <div style="display: flex; gap: 10px; margin-top: 15px;">
                    <span style="background: #e6f7ff; padding: 4px 12px; border-radius: 16px; font-size: 12px; color: #1890ff;">
                        ${this.getTemplateName(report.type)}
                    </span>
                    <span style="background: #f6f6f6; padding: 4px 12px; border-radius: 16px; font-size: 12px; color: #666;">
                        📊 包含 ${report.dataCardIds ? report.dataCardIds.length : 0} 个数据卡片
                    </span>
                    <span style="background: #f6f6f6; padding: 4px 12px; border-radius: 16px; font-size: 12px; color: #666;">
                        📅 ${new Date(report.createdAt).toLocaleDateString()}
                    </span>
                </div>
            </div>
            <div class="preview-content">
        `;

        // 模拟报表内容预览
        if (report.dataCardIds && report.dataCardIds.length > 0) {
            const selectedCards = report.dataCardIds.map(cardId => 
                this.dataCards.find(card => card.id === cardId)
            ).filter(Boolean);

            // 检查是否有有效的数据卡片
            if (selectedCards.length === 0) {
                previewContent += `
                    <div class="preview-placeholder">
                        <div class="icon">📊</div>
                        <p style="margin: 0 0 8px 0;">所选数据卡片不存在或已被删除</p>
                        <p style="margin: 0; font-size: 14px;">请重新编辑报表并选择有效的数据卡片</p>
                    </div>
                `;
            } else {
                // 根据布局类型显示不同的预览
                if (report.config?.layout === 'grid') {
                    previewContent += `<div class="preview-grid">`;
                } else if (report.config?.layout === 'column') {
                    previewContent += `<div class="preview-column">`;
                } else if (report.config?.layout === 'row') {
                    previewContent += `<div class="preview-row">`;
                } else {
                    previewContent += `<div class="preview-grid">`;
                }
                
                previewContent += selectedCards.map(card => `
                    <div class="preview-card">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                            <span style="font-size: 24px;">${this.getCardIcon(card.type)}</span>
                            <div>
                                <h4 style="margin: 0; font-size: 16px;">${card.name}</h4>
                                <span style="font-size: 12px; color: #999; background: #f5f5f5; padding: 2px 8px; border-radius: 10px;">
                                    ${this.getCardTypeText(card.type)}
                                </span>
                            </div>
                        </div>
                        <div class="preview-placeholder">
                            <div class="icon">${this.getCardIcon(card.type)}</div>
                            <p style="margin: 0 0 8px 0;">${this.getCardPreview(card.type)}</p>
                            <p style="margin: 0; font-size: 12px; color: #666;">${this.getCardTypeText(card.type)}预览图表</p>
                        </div>
                    </div>
                `).join('');
                
                previewContent += '</div>';
            }
        } else {
            previewContent += `
                <div class="preview-placeholder">
                    <div class="icon">📋</div>
                    <p style="margin: 0 0 8px 0;">该报表未包含任何数据卡片</p>
                    <p style="margin: 0; font-size: 14px;">请编辑报表并添加数据卡片</p>
                </div>
            `;
        }

        previewContent += '</div>';
        
        // 检查预览内容容器是否存在
        const previewContentElement = document.getElementById('reportPreviewContent');
        
        if (previewContentElement && previewModal) {
            previewContentElement.innerHTML = previewContent;
            previewModal.classList.add('show');
            
            // 添加调试信息
            console.log('报表预览模态框已显示');
            console.log('报表数据：', report);
        } else {
            console.error('报表预览模态框或内容容器不存在');
            alert('报表预览功能暂不可用，请检查页面结构');
        }
    }

    getCardPreview(type) {
        const previewMap = {
            'kpi': '¥1,234,567',
            'line': '📈 趋势图',
            'bar': '📊 柱状图',
            'pie': '🥧 饼图',
            'table': '📋 数据表格',
            'map': '🗺️ 地图'
        };
        return previewMap[type] || '📄 预览';
    }

    exportReport() {
        alert('导出报表功能（模拟）');
    }

    shareReport() {
        alert('分享报表功能（模拟）');
    }

    closeReportModal() {
        document.getElementById('reportModal').classList.remove('show');
    }

    closeReportPreviewModal() {
        document.getElementById('reportPreviewModal').classList.remove('show');
    }

    // 创建示例报表
    createSampleReport() {
        // 检查是否有可用的数据卡片
        if (this.dataCards.length === 0) {
            console.log('没有可用的数据卡片，跳过示例报表创建');
            return;
        }
        
        // 创建示例仪表盘报表
        const sampleReport = {
            id: Date.now(),
            name: '车辆安全监控仪表盘',
            type: 'dashboard',
            dataCardIds: this.dataCards.slice(0, 3).map(card => card.id), // 使用前3个数据卡片
            config: {
                layout: 'grid',
                timeRange: {
                    type: 'relative',
                    unit: 'this_month'
                },
                autoRefresh: {
                    enabled: false
                },
                filters: []
            },
            description: '车辆安全监控的示例仪表盘报表',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.reports.push(sampleReport);
        this.loadReports();
        
        console.log('示例报表创建完成：', sampleReport.name);
    }


}

// 初始化报表管理器
let reportsManager;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    reportsManager = new ReportsManager();
});

// 全局函数供HTML调用
function showCreateReportModal() {
    if (window.reportsManager) {
        reportsManager.showCreateReportModal();
    } else {
        console.error('报表管理器未初始化');
        alert('系统正在初始化，请稍后重试');
    }
}

function closeReportModal() {
    if (window.reportsManager) {
        reportsManager.closeReportModal();
    }
}

function closeReportPreviewModal() {
    if (window.reportsManager) {
        reportsManager.closeReportPreviewModal();
    }
}

function toggleReportConfig() {
    if (window.reportsManager) {
        reportsManager.toggleReportConfig();
    }
}

function toggleTimeRange() {
    if (window.reportsManager) {
        reportsManager.toggleTimeRange();
    }
}

function toggleRefreshInterval() {
    if (window.reportsManager) {
        reportsManager.toggleRefreshInterval();
    }
}

function updateLayout() {
    if (window.reportsManager) {
        reportsManager.updateLayout();
    }
}

function addFilter() {
    if (window.reportsManager) {
        reportsManager.addFilter();
    }
}

function removeFilter(button) {
    if (window.reportsManager) {
        reportsManager.removeFilter(button);
    }
}

function selectReportTemplate(templateType) {
    if (window.reportsManager) {
        reportsManager.selectReportTemplate(templateType);
    }
}

function saveReport() {
    if (window.reportsManager) {
        reportsManager.saveReport();
    }
}

function exportReport() {
    if (window.reportsManager) {
        reportsManager.exportReport();
    }
}

function shareReport() {
    if (window.reportsManager) {
        reportsManager.shareReport();
    }
}

