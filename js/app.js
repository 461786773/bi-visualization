// BI可视化工具主应用逻辑

// 全局状态
let currentStep = 0;
let currentDataSource = null;
let currentEditingMetric = null;

// 模拟数据
const demoData = {
    dataSources: [
        { id: 'mysql', name: 'MySQL数据库', type: 'mysql', status: 'connected', tables: 8 },
        { id: 'api', name: 'API数据源', type: 'api', status: 'connected', dataCount: 10000 }
    ],
    
    metrics: [
        { id: 'total_revenue', name: '总收入', displayName: '总收入', dataSource: 'mysql', formula: 'SUM(total_amount)', created: '2024-01-01' },
        { id: 'order_count', name: 'order_count', displayName: '订单数量', dataSource: 'mysql', formula: 'COUNT(*)', created: '2024-01-01' },
        { id: 'avg_order_value', name: 'avg_order_value', displayName: '平均订单价值', dataSource: 'mysql', formula: 'AVG(total_amount)', created: '2024-01-01' },
        { id: 'user_count', name: 'user_count', displayName: '用户数量', dataSource: 'api', formula: 'COUNT(DISTINCT user_id)', created: '2024-01-01' }
    ],
    
    dimensions: [
        { id: 'date', name: '时间维度', dataSource: 'mysql', type: 'temporal' },
        { id: 'product_category', name: '产品分类', dataSource: 'mysql', type: 'categorical' },
        { id: 'user_region', name: '用户地区', dataSource: 'api', type: 'categorical' }
    ],
    
    dataCards: [
        { id: 'revenue_trend', name: '收入趋势图', type: 'line', metrics: ['total_revenue'], dimensions: ['date'] },
        { id: 'category_analysis', name: '分类分析', type: 'bar', metrics: ['total_revenue'], dimensions: ['product_category'] },
        { id: 'regional_analysis', name: '区域分析', type: 'pie', metrics: ['user_count'], dimensions: ['user_region'] }
    ]
};

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    updateStepIndicator();
    showStepContent(currentStep);
});

// 显示步骤内容
function showStep(step) {
    currentStep = step;
    updateStepIndicator();
    showStepContent(step);
    
    // 更新导航菜单激活状态
    document.querySelectorAll('.nav-item').forEach((item, index) => {
        if (index === step) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// 更新步骤指示器
function updateStepIndicator() {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        const circle = step.querySelector('.step-circle');
        if (index === currentStep) {
            circle.style.background = '#1890ff';
            circle.style.color = 'white';
        } else if (index < currentStep) {
            circle.style.background = '#52c41a';
            circle.style.color = 'white';
        } else {
            circle.style.background = '#f0f0f0';
            circle.style.color = '#666';
        }
    });
}

// 显示步骤内容
function showStepContent(step) {
    const stepContent = document.getElementById('stepContent');
    const title = document.getElementById('currentStepTitle');
    const buttonText = document.getElementById('createButtonText');
    
    const stepTitles = [
        '🗄️ 数据源管理',
        '🎯 指标定义', 
        '📏 维度配置',
        '📊 数据卡片',
        '📋 报表配置'
    ];
    
    const buttonTexts = [
        '创建数据源',
        '创建指标',
        '创建维度', 
        '创建数据卡片',
        '创建报表'
    ];
    
    title.textContent = stepTitles[step];
    buttonText.textContent = buttonTexts[step];
    
    switch(step) {
        case 0:
            showDataSourceStep();
            break;
        case 1:
            showMetricsStep();
            break;
        case 2:
            showDimensionsStep();
            break;
        case 3:
            showDataCardsStep();
            break;
        case 4:
            showReportsStep();
            break;
    }
}

// 步骤1：数据源管理
function showDataSourceStep() {
    const content = `
        <div class="cards-grid">
            ${demoData.dataSources.map(ds => `
                <div class="card">
                    <div class="card-title">🗄️ ${ds.name}</div>
                    <div class="card-content">
                        <p><strong>连接状态：</strong>${ds.status === 'connected' ? '✅ 已连接' : '❌ 未连接'}</p>
                        <p><strong>类型：</strong>${getDataSourceTypeText(ds.type)}</p>
                        ${ds.tables ? `<p><strong>表数量：</strong>${ds.tables}个</p>` : ''}
                        ${ds.dataCount ? `<p><strong>数据量：</strong>${ds.dataCount.toLocaleString()}+ 条</p>` : ''}
                    </div>
                    <div class="card-actions">
                        <button class="btn btn-primary" onclick="useDataSource('${ds.id}')">使用此数据源</button>
                        <button class="btn btn-secondary" onclick="editDataSource('${ds.id}')">编辑配置</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    document.getElementById('stepContent').innerHTML = content;
}

// 步骤2：指标定义
function showMetricsStep() {
    if (!currentDataSource) {
        document.getElementById('stepContent').innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #666;">
                <div style="font-size: 48px; margin-bottom: 20px;">📊</div>
                <h3>请先选择数据源</h3>
                <p>您需要先选择一个数据源，然后才能定义指标</p>
                <button class="btn btn-primary" onclick="showStep(0)" style="margin-top: 20px;">选择数据源</button>
            </div>
        `;
        return;
    }
    
    const metrics = demoData.metrics.filter(m => m.dataSource === currentDataSource);
    
    const content = `
        <div class="metrics-table-container">
            <div class="metrics-table-header">
                <div class="table-title">指标列表 (${metrics.length} 个)</div>
                <button class="btn btn-primary" onclick="createMetric()">
                    <span>➕</span> 创建新指标
                </button>
            </div>
            <table class="metrics-table">
                <thead>
                    <tr>
                        <th>指标名称</th>
                        <th>显示名称</th>
                        <th>计算公式</th>
                        <th>数据源</th>
                        <th>创建时间</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    ${metrics.map(metric => `
                        <tr>
                            <td><strong>${metric.name}</strong></td>
                            <td>${metric.displayName || metric.name}</td>
                            <td><code>${metric.formula}</code></td>
                            <td>${getDataSourceName(metric.dataSource)}</td>
                            <td>${metric.created || '未知'}</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn-small primary" onclick="editMetric('${metric.id}')">编辑</button>
                                    <button class="btn-small secondary" onclick="viewMetricDetails('${metric.id}')">查看</button>
                                    <button class="btn-small danger" onclick="deleteMetric('${metric.id}')">删除</button>
                                    <button class="btn-small" onclick="configureDimensions('${metric.id}')">维度</button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div style="margin-top: 30px;">
            <h3>指标统计</h3>
            <div class="cards-grid">
                <div class="card">
                    <div class="card-title">📊 基础指标</div>
                    <div class="card-content">
                        <p>简单计算指标，易于理解和维护</p>
                        <p><strong>数量:</strong> ${metrics.filter(m => !m.formula.includes('/') && !m.formula.includes('*') && !m.formula.includes('-')).length} 个</p>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-title">🧮 复合指标</div>
                    <div class="card-content">
                        <p>自定义计算公式，支持复杂业务逻辑</p>
                        <p><strong>数量:</strong> ${metrics.filter(m => m.formula.includes('/') || m.formula.includes('*') || m.formula.includes('-')).length} 个</p>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-title">📈 计算类型</div>
                    <div class="card-content">
                        <p><strong>SUM:</strong> ${metrics.filter(m => m.formula.includes('SUM')).length} 个</p>
                        <p><strong>COUNT:</strong> ${metrics.filter(m => m.formula.includes('COUNT')).length} 个</p>
                        <p><strong>AVG:</strong> ${metrics.filter(m => m.formula.includes('AVG')).length} 个</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div style="margin-top: 30px;">
            <h3>快速创建指标</h3>
            <div class="cards-grid">
                <div class="card">
                    <div class="card-title">💰 收入相关指标</div>
                    <div class="card-content">
                        <p>快速创建与业务收入相关的指标</p>
                        <ul style="margin-top: 10px; padding-left: 20px;">
                            <li>总收入 (SUM(total_amount))</li>
                            <li>平均订单价值 (AVG(total_amount))</li>
                            <li>订单数量 (COUNT(*))</li>
                        </ul>
                    </div>
                    <div class="card-actions">
                        <button class="btn btn-primary" onclick="quickCreateRevenueMetric()">快速创建</button>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-title">👥 用户相关指标</div>
                    <div class="card-content">
                        <p>快速创建与用户行为相关的指标</p>
                        <ul style="margin-top: 10px; padding-left: 20px;">
                            <li>用户数量 (COUNT(DISTINCT user_id))</li>
                            <li>活跃用户数</li>
                            <li>用户留存率</li>
                        </ul>
                    </div>
                    <div class="card-actions">
                        <button class="btn btn-primary" onclick="quickCreateUserMetric()">快速创建</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.getElementById('stepContent').innerHTML = content;
}

// 步骤3：维度配置
function showDimensionsStep() {
    if (!currentDataSource) {
        document.getElementById('stepContent').innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #666;">
                <div style="font-size: 48px; margin-bottom: 20px;">📏</div>
                <h3>请先选择数据源</h3>
                <p>您需要先选择一个数据源，然后才能配置维度</p>
                <button class="btn btn-primary" onclick="showStep(0)" style="margin-top: 20px;">选择数据源</button>
            </div>
        `;
        return;
    }
    
    const dimensions = demoData.dimensions.filter(d => d.dataSource === currentDataSource);
    
    const content = `
        <div class="cards-grid">
            ${dimensions.map(dim => `
                <div class="card">
                    <div class="card-title">📏 ${dim.name}</div>
                    <div class="card-content">
                        <p><strong>类型：</strong>${getDimensionTypeText(dim.type)}</p>
                        <p><strong>数据源：</strong>${getDataSourceName(dim.dataSource)}</p>
                        <p><strong>关联指标：</strong>${getRelatedMetricsCount(dim.id)} 个</p>
                    </div>
                    <div class="card-actions">
                        <button class="btn btn-primary" onclick="createDataCard('${dim.id}')">创建数据卡片</button>
                        <button class="btn btn-secondary" onclick="editDimension('${dim.id}')">编辑</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    document.getElementById('stepContent').innerHTML = content;
}

// 步骤4：数据卡片
function showDataCardsStep() {
    if (!currentDataSource) {
        document.getElementById('stepContent').innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #666;">
                <div style="font-size: 48px; margin-bottom: 20px;">📊</div>
                <h3>请先选择数据源</h3>
                <p>您需要先选择一个数据源，然后才能创建数据卡片</p>
                <button class="btn btn-primary" onclick="showStep(0)" style="margin-top: 20px;">选择数据源</button>
            </div>
        `;
        return;
    }
    
    const cards = demoData.dataCards.filter(card => {
        const metric = demoData.metrics.find(m => m.id === card.metrics[0]);
        return metric && metric.dataSource === currentDataSource;
    });
    
    const content = `
        <div class="cards-grid">
            ${cards.map(card => `
                <div class="card">
                    <div class="card-title">📊 ${card.name}</div>
                    <div class="card-content">
                        <p><strong>图表类型：</strong>${getChartTypeText(card.type)}</p>
                        <p><strong>指标：</strong>${getMetricName(card.metrics[0])}</p>
                        <p><strong>维度：</strong>${getDimensionName(card.dimensions[0])}</p>
                    </div>
                    <div class="card-actions">
                        <button class="btn btn-primary" onclick="previewCard('${card.id}')">预览</button>
                        <button class="btn btn-primary" onclick="addToReport('${card.id}')">添加到报表</button>
                    </div>
                </div>
            `).join('')}
            
            <!-- 默认数据卡片模板 -->
            <div class="card">
                <div class="card-title">📊 收入趋势分析</div>
                <div class="card-content">
                    <p><strong>图表类型：</strong>折线图</p>
                    <p><strong>指标：</strong>总收入</p>
                    <p><strong>维度：</strong>时间维度</p>
                </div>
                <div class="card-actions">
                    <button class="btn btn-primary" onclick="useDefaultCard('revenue_trend')">使用模板</button>
                </div>
            </div>
            
            <div class="card">
                <div class="card-title">📊 分类分析</div>
                <div class="card-content">
                    <p><strong>图表类型：</strong>柱状图</p>
                    <p><strong>指标：</strong>总收入</p>
                    <p><strong>维度：</strong>产品分类</p>
                </div>
                <div class="card-actions">
                    <button class="btn btn-primary" onclick="useDefaultCard('category_analysis')">使用模板</button>
                </div>
            </div>
        </div>
    `;
    document.getElementById('stepContent').innerHTML = content;
}

// 步骤5：报表配置
function showReportsStep() {
    const content = `
        <div style="text-align: center; padding: 60px 20px;">
            <div style="font-size: 48px; margin-bottom: 20px;">🎉</div>
            <h3>报表配置完成！</h3>
            <p>您已经完成了BI可视化工具的完整配置流程</p>
            <div style="margin-top: 30px; display: flex; justify-content: center; gap: 16px;">
                <button class="btn btn-primary" onclick="generateReport()">生成报表</button>
                <button class="btn btn-secondary" onclick="showStep(0)">重新开始</button>
            </div>
        </div>
    `;
    document.getElementById('stepContent').innerHTML = content;
}

// 使用数据源
function useDataSource(dataSourceId) {
    currentDataSource = dataSourceId;
    alert(`已选择数据源: ${getDataSourceName(dataSourceId)}`);
    showStep(1); // 自动跳转到指标定义步骤
}

// 配置维度
function configureDimensions(metricId) {
    alert(`为指标 ${getMetricName(metricId)} 配置维度`);
    showStep(2); // 跳转到维度配置步骤
}

// 创建数据卡片
function createDataCard(dimensionId) {
    alert(`基于维度 ${getDimensionName(dimensionId)} 创建数据卡片`);
    showStep(3); // 跳转到数据卡片步骤
}

// 预览数据卡片
function previewCard(cardId) {
    const card = demoData.dataCards.find(c => c.id === cardId);
    if (card) {
        alert(`预览数据卡片: ${card.name}\n图表类型: ${getChartTypeText(card.type)}`);
    }
}

// 添加到报表
function addToReport(cardId) {
    const card = demoData.dataCards.find(c => c.id === cardId);
    if (card) {
        alert(`数据卡片 \"${card.name}\" 已添加到报表`);
        showStep(4); // 跳转到报表配置步骤
    }
}

// 使用默认数据卡片
function useDefaultCard(cardType) {
    alert(`已使用默认数据卡片模板: ${cardType}`);
    showStep(4); // 跳转到报表配置步骤
}

// 生成报表
function generateReport() {
    alert('报表生成成功！\n\n您可以在报表中心查看完整的可视化分析报告。');
}

// 创建新项目
function createNewItem() {
    switch(currentStep) {
        case 0: // 数据源管理
            openCreateDataSourceModal();
            break;
        case 1: // 指标定义
            createMetric();
            break;
        case 2: // 维度配置
            openCreateDimensionModal();
            break;
        case 3: // 数据卡片
            openCreateDataCardModal();
            break;
        case 4: // 报表配置
            openCreateReportModal();
            break;
    }
}

function openCreateDataSourceModal() {
    const modal = document.getElementById('createModal');
    const modalTitle = document.getElementById('modalTitle');
    modalTitle.textContent = '创建数据源';
    modal.classList.add('show');
}

function openCreateDimensionModal() {
    alert('维度创建功能即将推出');
}

function openCreateDataCardModal() {
    alert('数据卡片创建功能即将推出');
}

function openCreateReportModal() {
    alert('报表创建功能即将推出');
}

// 关闭模态框
function closeModal() {
    document.getElementById('createModal').classList.remove('show');
}

// 保存项目
function saveItem() {
    const name = document.getElementById('itemName').value;
    const type = document.getElementById('itemType').value;
    
    if (!name) {
        alert('请输入名称');
        return;
    }
    
    alert(`创建成功: ${name} (${type})`);
    closeModal();
}

// 辅助函数
function getDataSourceTypeText(type) {
    const types = {
        'mysql': 'MySQL数据库',
        'api': 'API接口',
        'file': '文件上传'
    };
    return types[type] || type;
}

function getDataSourceName(id) {
    const ds = demoData.dataSources.find(d => d.id === id);
    return ds ? ds.name : id;
}

function getDimensionTypeText(type) {
    const types = {
        'temporal': '时间维度',
        'categorical': '分类维度',
        'numerical': '数值维度'
    };
    return types[type] || type;
}

function getMetricName(id) {
    const metric = demoData.metrics.find(m => m.id === id);
    return metric ? (metric.displayName || metric.name) : id;
}

function getDimensionName(id) {
    const dim = demoData.dimensions.find(d => d.id === id);
    return dim ? dim.name : id;
}

function getChartTypeText(type) {
    const types = {
        'line': '折线图',
        'bar': '柱状图',
        'pie': '饼图'
    };
    return types[type] || type;
}

function getRelatedMetricsCount(dimensionId) {
    // 简单模拟：返回1-3之间的随机数
    return Math.floor(Math.random() * 3) + 1;
}

// ============ 指标管理功能 ============

// 创建指标
function createMetric() {
    if (!currentDataSource) {
        alert('请先选择数据源');
        showStep(0);
        return;
    }
    
    currentEditingMetric = null;
    openMetricModal('创建指标');
}

// 编辑指标
function editMetric(metricId) {
    const metric = demoData.metrics.find(m => m.id === metricId);
    if (!metric) return;
    
    currentEditingMetric = metric;
    openMetricModal('编辑指标');
}

// 打开指标模态框
function openMetricModal(title) {
    const modal = document.getElementById('metricModal');
    const modalTitle = document.getElementById('metricModalTitle');
    const dataSourceSelect = document.getElementById('metricDataSource');
    
    modalTitle.textContent = title;
    
    // 填充数据源选项
    dataSourceSelect.innerHTML = '<option value="">请选择数据源</option>';
    demoData.dataSources.forEach(ds => {
        const option = document.createElement('option');
        option.value = ds.id;
        option.textContent = ds.name;
        dataSourceSelect.appendChild(option);
    });
    
    // 设置默认数据源
    if (currentDataSource) {
        dataSourceSelect.value = currentDataSource;
    }
    
    // 如果是编辑模式，填充数据
    if (currentEditingMetric) {
        document.getElementById('metricName').value = currentEditingMetric.name;
        document.getElementById('metricDisplayName').value = currentEditingMetric.displayName || currentEditingMetric.name;
        document.getElementById('metricDescription').value = currentEditingMetric.description || '';
        
        // 解析公式类型
        const formula = currentEditingMetric.formula;
        if (formula.includes('SUM') || formula.includes('COUNT') || formula.includes('AVG') || formula.includes('MAX') || formula.includes('MIN')) {
            // 基础计算方式
            document.querySelector('input[name="calculationType"][value="basic"]').checked = true;
            toggleCalculationType();
            
            // 提取计算类型和字段
            const match = formula.match(/(SUM|COUNT|AVG|MAX|MIN)\((.*?)\)/);
            if (match) {
                const calcType = match[1].toLowerCase();
                const field = match[2];
                document.getElementById('basicCalculationType').value = calcType;
                document.getElementById('calculationField').value = field;
            }
        } else {
            // 自定义计算方式
            document.querySelector('input[name="calculationType"][value="custom"]').checked = true;
            toggleCalculationType();
            document.getElementById('customFormula').value = formula;
        }
        
        updateFormulaPreview();
    } else {
        // 创建模式，重置表单
        resetMetricForm();
    }
    
    modal.classList.add('show');
}

// 关闭指标模态框
function closeMetricModal() {
    document.getElementById('metricModal').classList.remove('show');
    currentEditingMetric = null;
}

// 重置指标表单
function resetMetricForm() {
    document.getElementById('metricName').value = '';
    document.getElementById('metricDisplayName').value = '';
    document.getElementById('metricDescription').value = '';
    document.querySelector('input[name="calculationType"][value="basic"]').checked = true;
    toggleCalculationType();
    document.getElementById('basicCalculationType').value = 'sum';
    document.getElementById('calculationField').value = '';
    document.getElementById('customFormula').value = '';
    updateFormulaPreview();
}

// 切换计算类型
function toggleCalculationType() {
    const calculationType = document.querySelector('input[name="calculationType"]:checked').value;
    const basicSection = document.getElementById('basicCalculation');
    const customSection = document.getElementById('customCalculation');
    
    if (calculationType === 'basic') {
        basicSection.style.display = 'block';
        customSection.style.display = 'none';
    } else {
        basicSection.style.display = 'none';
        customSection.style.display = 'block';
    }
    updateFormulaPreview();
}

// 更新公式预览
function updateFormulaPreview() {
    const preview = document.getElementById('formulaPreview');
    const calculationType = document.querySelector('input[name="calculationType"]:checked').value;
    
    if (calculationType === 'basic') {
        const calcType = document.getElementById('basicCalculationType').value.toUpperCase();
        const field = document.getElementById('calculationField').value || 'field';
        preview.textContent = `${calcType}(${field})`;
    } else {
        const formula = document.getElementById('customFormula').value;
        preview.textContent = formula || '请输入自定义公式';
    }
}

// 保存指标
function saveMetric() {
    const name = document.getElementById('metricName').value.trim();
    const displayName = document.getElementById('metricDisplayName').value.trim();
    const dataSource = document.getElementById('metricDataSource').value;
    const description = document.getElementById('metricDescription').value.trim();
    const calculationType = document.querySelector('input[name="calculationType"]:checked').value;
    
    if (!name) {
        alert('请输入指标名称');
        return;
    }
    
    if (!dataSource) {
        alert('请选择数据源');
        return;
    }
    
    let formula = '';
    if (calculationType === 'basic') {
        const calcType = document.getElementById('basicCalculationType').value.toUpperCase();
        const field = document.getElementById('calculationField').value.trim();
        if (!field) {
            alert('请输入计算字段');
            return;
        }
        formula = `${calcType}(${field})`;
    } else {
        formula = document.getElementById('customFormula').value.trim();
        if (!formula) {
            alert('请输入自定义公式');
            return;
        }
    }
    
    if (currentEditingMetric) {
        // 编辑现有指标
        currentEditingMetric.name = name;
        currentEditingMetric.displayName = displayName || name;
        currentEditingMetric.dataSource = dataSource;
        currentEditingMetric.formula = formula;
        currentEditingMetric.description = description;
        alert('指标更新成功！');
    } else {
        // 创建新指标
        const newMetric = {
            id: 'metric_' + Date.now(),
            name: name,
            displayName: displayName || name,
            dataSource: dataSource,
            formula: formula,
            description: description,
            created: new Date().toLocaleDateString()
        };
        demoData.metrics.push(newMetric);
        alert('指标创建成功！');
    }
    
    closeMetricModal();
    showMetricsStep(); // 刷新指标列表
}

// 删除指标
function deleteMetric(metricId) {
    if (confirm('确定要删除这个指标吗？')) {
        const index = demoData.metrics.findIndex(m => m.id === metricId);
        if (index !== -1) {
            demoData.metrics.splice(index, 1);
            alert('指标删除成功！');
            showMetricsStep();
        }
    }
}

// 查看指标详情
function viewMetricDetails(metricId) {
    const metric = demoData.metrics.find(m => m.id === metricId);
    if (metric) {
        const details = `
指标名称: ${metric.name}
显示名称: ${metric.displayName}
数据源: ${getDataSourceName(metric.dataSource)}
计算公式: ${metric.formula}
创建时间: ${metric.created}
描述: ${metric.description || '无'}
        `;
        alert(details);
    }
}

// 快速创建收入相关指标
function quickCreateRevenueMetric() {
    if (!currentDataSource) {
        alert('请先选择数据源');
        return;
    }
    
    const quickMetrics = [
        { name: 'total_revenue', displayName: '总收入', formula: 'SUM(total_amount)' },
        { name: 'avg_order_value', displayName: '平均订单价值', formula: 'AVG(total_amount)' },
        { name: 'order_count', displayName: '订单数量', formula: 'COUNT(*)' }
    ];
    
    quickMetrics.forEach(metric => {
        const exists = demoData.metrics.find(m => m.name === metric.name && m.dataSource === currentDataSource);
        if (!exists) {
            demoData.metrics.push({
                id: 'metric_' + Date.now() + '_' + Math.random(),
                name: metric.name,
                displayName: metric.displayName,
                dataSource: currentDataSource,
                formula: metric.formula,
                created: new Date().toLocaleDateString()
            });
        }
    });
    
    alert('已快速创建收入相关指标！');
    showMetricsStep();
}

// 快速创建用户相关指标
function quickCreateUserMetric() {
    if (!currentDataSource) {
        alert('请先选择数据源');
        return;
    }
    
    const quickMetrics = [
        { name: 'user_count', displayName: '用户数量', formula: 'COUNT(DISTINCT user_id)' },
        { name: 'active_users', displayName: '活跃用户数', formula: 'COUNT(DISTINCT user_id) WHERE status = \'active\'' },
        { name: 'retention_rate', displayName: '用户留存率', formula: 'COUNT(DISTINCT retained_users) / COUNT(DISTINCT total_users)' }
    ];
    
    quickMetrics.forEach(metric => {
        const exists = demoData.metrics.find(m => m.name === metric.name && m.dataSource === currentDataSource);
        if (!exists) {
            demoData.metrics.push({
                id: 'metric_' + Date.now() + '_' + Math.random(),
                name: metric.name,
                displayName: metric.displayName,
                dataSource: currentDataSource,
                formula: metric.formula,
                created: new Date().toLocaleDateString()
            });
        }
    });
    
    alert('已快速创建用户相关指标！');
    showMetricsStep();
}