// 指标定义逻辑
class MetricsManager {
    constructor() {

        this.metrics = this.loadMetricsFromConfig();
        // 使用统一的数据配置文件
        this.dataSources = window.DataConfig?.dataSources || [];
        this.init();
    }
    
    // 从dataConfig中加载指标
    loadMetricsFromConfig() {
        // 如果dataConfig中有指标数据，直接使用
        if (window.DataConfig?.metrics) {
            return window.DataConfig.metrics;
        }
        
        // 否则创建示例指标
        return [
            {
                id: 1,
                name: 'total_security_events',
                displayName: '安全事件总数',
                dataSourceId: 1, // 车辆安全监控数据源
                calculationType: 'basic',
                formula: 'COUNT(event_id)',
                description: '计算所有安全事件的总数量',
                selectedFields: ['event_id'],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 2,
                name: 'avg_anomaly_confidence',
                displayName: '异常检测平均置信度',
                dataSourceId: 1, // 车辆安全监控数据源
                calculationType: 'basic',
                formula: 'AVG(confidence_score)',
                description: '计算异常检测的平均置信度评分',
                selectedFields: ['confidence_score'],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 3,
                name: 'active_vehicles',
                displayName: '活跃车辆数',
                dataSourceId: 1, // 车辆安全监控数据源
                calculationType: 'basic',
                formula: 'COUNT(DISTINCT vehicle_id)',
                description: '计算活跃车辆数量',
                selectedFields: ['vehicle_id'],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 4,
                name: 'attack_prevention_rate',
                displayName: '攻击阻止率',
                dataSourceId: 2, // 网络安全事件数据源
                calculationType: 'custom',
                formula: 'COUNT(prevented) / COUNT(detection_id)',
                description: '计算网络攻击成功阻止的比例',
                selectedFields: ['prevented', 'detection_id'],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 5,
                name: 'system_uptime',
                displayName: '系统运行时间',
                dataSourceId: 3, // 系统运行状态数据源
                calculationType: 'basic',
                formula: 'AVG(uptime)',
                description: '计算系统平均运行时间',
                selectedFields: ['uptime'],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
    }

    init() {
        this.loadMetrics();
        this.loadDataSources();
        this.setupEventListeners();
        // 确保数据源下拉框已正确初始化后加载数据表
        // 延迟执行，确保数据源已完全加载到下拉框中
        setTimeout(() => {
            this.loadDataSourceTables();
        }, 100);
    }

    setupEventListeners() {
        // 计算方式切换
        document.querySelectorAll('input[name="calculationType"]').forEach(radio => {
            radio.addEventListener('change', () => this.toggleCalculationType());
        });

        // 公式预览更新
        document.getElementById('basicCalculationType').addEventListener('change', () => this.updateFormulaPreview());
        document.getElementById('customFormula').addEventListener('input', () => this.updateFormulaPreview());

        // 数据源切换 - 在模态框显示时动态绑定
        // 数据表切换 - 在模态框显示时动态绑定

        // 搜索功能
        document.getElementById('searchMetric').addEventListener('input', () => this.filterMetrics());
        document.getElementById('filterDataSource').addEventListener('change', () => this.filterMetrics());

        // 模态框关闭事件监听器
        this.setupModalCloseListeners();
    }

    // 设置模态框关闭事件监听器
    setupModalCloseListeners() {
        // 指标模态框关闭按钮
        const closeMetricModalBtn = document.getElementById('closeMetricModalBtn');
        if (closeMetricModalBtn) {
            closeMetricModalBtn.addEventListener('click', () => this.closeMetricModal());
        }
        
        // 取消按钮
        const cancelMetricBtn = document.getElementById('cancelMetricBtn');
        if (cancelMetricBtn) {
            cancelMetricBtn.addEventListener('click', () => this.closeMetricModal());
        }
        
        // 快速创建模态框关闭按钮
        const closeQuickCreateModalBtn = document.getElementById('closeQuickCreateModalBtn');
        if (closeQuickCreateModalBtn) {
            closeQuickCreateModalBtn.addEventListener('click', () => this.closeQuickCreateModal());
        }
        
        // 模态框背景点击关闭
        const metricModal = document.getElementById('metricModal');
        const quickCreateModal = document.getElementById('quickCreateModal');
        
        if (metricModal) {
            metricModal.addEventListener('click', (e) => {
                if (e.target === metricModal) {
                    this.closeMetricModal();
                }
            });
        }
        
        if (quickCreateModal) {
            quickCreateModal.addEventListener('click', (e) => {
                if (e.target === quickCreateModal) {
                    this.closeQuickCreateModal();
                }
            });
        }
    }

    loadDataSources() {
        const dataSourceSelect = document.getElementById('metricDataSource');
        const filterDataSource = document.getElementById('filterDataSource');
        
        // 清空选项（保留第一个选项）
        while (dataSourceSelect.children.length > 1) {
            dataSourceSelect.removeChild(dataSourceSelect.lastChild);
        }
        while (filterDataSource.children.length > 1) {
            filterDataSource.removeChild(filterDataSource.lastChild);
        }

        // 添加数据源选项
        this.dataSources.forEach(ds => {
            const option = document.createElement('option');
            option.value = ds.id.toString(); // 转换为字符串确保类型一致
            option.textContent = ds.name;
            dataSourceSelect.appendChild(option);

            const filterOption = document.createElement('option');
            filterOption.value = ds.id.toString(); // 转换为字符串确保类型一致
            filterOption.textContent = ds.name;
            filterDataSource.appendChild(filterOption);
        });
        
        // 设置默认选择第一个数据源，并延迟加载数据表以确保DOM已准备好
        if (dataSourceSelect.children.length > 1) {
            dataSourceSelect.value = this.dataSources[0].id.toString();
            // 延迟执行，确保DOM已完全加载
            setTimeout(() => {
                this.loadDataSourceTables();
            }, 0);
        }
    }

    loadDataSourceTables() {
        const dataSourceSelect = document.getElementById('metricDataSource');
        const tableSelect = document.getElementById('metricTable');
        
        if (!dataSourceSelect || !tableSelect) {
            console.error('数据源或数据表选择器未找到');
            return;
        }
        
        // 使用let而不是const，因为可能需要重新赋值
        let dataSourceId = dataSourceSelect.value; // 保持字符串类型
        
        // 完全清空选项，重新创建所有选项
        tableSelect.innerHTML = '';
        
        // 添加默认选项
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '请选择数据表';
        tableSelect.appendChild(defaultOption);

        // 如果没有选择数据源，但数据源下拉框有选项，则默认选择第一个
        if (!dataSourceId && dataSourceSelect.children.length > 1) {
            dataSourceSelect.value = this.dataSources[0].id.toString();
            // 更新dataSourceId变量
            dataSourceId = this.dataSources[0].id.toString();
        }

        if (!dataSourceId) {
            console.log('没有选择数据源，退出加载数据表');
            return;
        }

        // 使用统一的数据配置文件
        const dataSourceTables = window.DataConfig?.dataSourceTables || {};

        console.log('当前数据源ID:', dataSourceId, '类型:', typeof dataSourceId);
        console.log('可用的数据源表映射:', Object.keys(dataSourceTables));
        console.log('查找的表数据:', dataSourceTables[dataSourceId]);

        // 确保 dataSourceId 是字符串类型，因为 dataSourceTables 的键是字符串
        const dataSourceIdStr = String(dataSourceId);
        const tables = dataSourceTables[dataSourceIdStr] || [
            { value: 'sample_table', text: '示例数据表 - 通用示例数据 (sample_table)' },
            { value: 'demo_data', text: '演示数据表 - 测试演示数据 (demo_data)' }
        ];
        
        console.log('转换后的数据源ID:', dataSourceIdStr, '类型:', typeof dataSourceIdStr);
        console.log('实际获取的表数据:', tables);

        tables.forEach(table => {
            const option = document.createElement('option');
            option.value = table.value;
            option.textContent = table.text;
            tableSelect.appendChild(option);
        });
    }

    loadTableFields() {
        const tableName = document.getElementById('metricTable').value;
        const availableFieldsContainer = document.getElementById('availableFields');
        const selectedFieldsContainer = document.getElementById('selectedFields');
        
        // 清空已选字段
        selectedFieldsContainer.innerHTML = '<div class="no-fields">暂无选中字段</div>';
        
        if (!tableName) {
            availableFieldsContainer.innerHTML = '<div class="no-fields">请先选择数据表以加载字段</div>';
            return;
        }

        // 使用统一的数据配置文件
        const tableFields = window.DataConfig?.tableFields || {};

        const fields = tableFields[tableName] || [
            { name: 'id', type: 'int', description: '唯一标识' },
            { name: 'name', type: 'varchar', description: '名称' },
            { name: 'value', type: 'decimal', description: '数值' },
            { name: 'created_at', type: 'date', description: '创建时间' }
        ];
        
        if (fields.length === 0) {
            availableFieldsContainer.innerHTML = '<div class="no-fields">该数据表暂无可用字段</div>';
            return;
        }

        availableFieldsContainer.innerHTML = fields.map(field => `
            <div class="field-item" onclick="this.classList.toggle('selected')" title="${field.description}">
                <input type="checkbox" style="display: none;">
                <div class="field-name">${field.name}</div>
                <div class="field-type">${field.type}</div>
                <div class="field-description">${field.description}</div>
            </div>
        `).join('');
    }

    addSelectedFields() {
        const availableFields = document.querySelectorAll('#availableFields .field-item.selected');
        const selectedFieldsContainer = document.getElementById('selectedFields');
        
        if (availableFields.length === 0) {
            alert('请先选择要添加的字段');
            return;
        }

        // 清空"暂无选中字段"提示
        if (selectedFieldsContainer.querySelector('.no-fields')) {
            selectedFieldsContainer.innerHTML = '';
        }

        availableFields.forEach(field => {
            const fieldName = field.querySelector('.field-name').textContent;
            const fieldType = field.querySelector('.field-type').textContent;
            
            // 检查是否已存在
            if (!selectedFieldsContainer.querySelector(`[data-field="${fieldName}"]`)) {
                const fieldElement = document.createElement('div');
                fieldElement.className = 'field-item';
                fieldElement.setAttribute('data-field', fieldName);
                fieldElement.innerHTML = `
                    <div class="field-name">${fieldName}</div>
                    <div class="field-type">${fieldType}</div>
                    <button class="remove-field" onclick="metricsManager.removeSelectedField('${fieldName}')">×</button>
                `;
                selectedFieldsContainer.appendChild(fieldElement);
            }
            
            // 取消选中状态
            field.classList.remove('selected');
        });

        // 更新计算字段选择
        this.updateCalculationFields();
    }

    removeSelectedField(fieldName) {
        const fieldElement = document.querySelector(`#selectedFields [data-field="${fieldName}"]`);
        if (fieldElement) {
            fieldElement.remove();
        }
        
        // 如果已选字段为空，显示提示
        const selectedFieldsContainer = document.getElementById('selectedFields');
        if (selectedFieldsContainer.children.length === 0) {
            selectedFieldsContainer.innerHTML = '<div class="no-fields">暂无选中字段</div>';
        }

        // 更新计算字段选择
        this.updateCalculationFields();
    }

    updateCalculationFields() {
        const selectedFields = Array.from(document.querySelectorAll('#selectedFields .field-item')).map(item => 
            item.getAttribute('data-field')
        ).filter(Boolean);
        
        const container = document.getElementById('calculationFieldsContainer');
        
        if (selectedFields.length === 0) {
            container.innerHTML = '<div class="no-fields">请先选择字段</div>';
            return;
        }

        container.innerHTML = selectedFields.map(field => `
            <div class="calculation-field-item">
                <div class="field-name">${field}</div>
                <button class="remove-field" onclick="metricsManager.removeCalculationField('${field}')">×</button>
            </div>
        `).join('');
    }

    removeCalculationField(fieldName) {
        // 同时从已选字段中移除
        this.removeSelectedField(fieldName);
    }

    getSelectedFields() {
        return Array.from(document.querySelectorAll('#selectedFields .field-item')).map(item => 
            item.getAttribute('data-field')
        ).filter(Boolean);
    }

    toggleCalculationType() {
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
        
        this.updateFormulaPreview();
    }

    updateFormulaPreview() {
        const calculationType = document.querySelector('input[name="calculationType"]:checked').value;
        const previewElement = document.getElementById('formulaPreview');
        
        let formula = '';
        
        if (calculationType === 'basic') {
            const calcType = document.getElementById('basicCalculationType').value;
            const selectedFields = this.getSelectedFields();
            
            if (selectedFields.length === 0) {
                formula = '请先选择计算字段';
            } else {
                const functionMap = {
                    'sum': 'SUM',
                    'count': 'COUNT',
                    'avg': 'AVG',
                    'max': 'MAX',
                    'min': 'MIN',
                    'distinct': 'COUNT(DISTINCT)'
                };
                
                // 支持多字段计算
                if (selectedFields.length === 1) {
                    formula = `${functionMap[calcType]}(${selectedFields[0]})`;
                } else {
                    // 多字段计算示例
                    if (calcType === 'avg') {
                        formula = `${functionMap['sum']}(${selectedFields[0]}) / ${functionMap['count']}(${selectedFields[1]})`;
                    } else if (calcType === 'distinct') {
                        formula = `${functionMap['count']}(DISTINCT ${selectedFields.join(', ')})`;
                    } else {
                        formula = `${functionMap[calcType]}(${selectedFields.join(' + ')})`;
                    }
                }
            }
        } else {
            formula = document.getElementById('customFormula').value || '请输入自定义公式';
        }
        
        previewElement.textContent = formula || '公式预览';
    }

    loadMetrics() {
        const tbody = document.getElementById('metricList');
        const cardsContainer = document.getElementById('metricCards');
        
        if (this.metrics.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px;">暂无指标，点击"创建指标"开始添加</td></tr>';
            cardsContainer.innerHTML = '';
            return;
        }

        // 表格视图
        tbody.innerHTML = this.metrics.map((metric, index) => {
            const dataSource = this.dataSources.find(ds => ds.id === metric.dataSourceId) || { name: '未知数据源' };
            return `
                <tr>
                    <td>${metric.name}</td>
                    <td>${metric.displayName}</td>
                    <td>${dataSource.name}</td>
                    <td>${metric.calculationType === 'basic' ? '基础计算' : '自定义计算'}</td>
                    <td><code>${metric.formula}</code></td>
                    <td>${new Date(metric.createdAt).toLocaleDateString()}</td>
                    <td class="action-buttons">
                        <button class="btn-small primary" onclick="metricsManager.editMetric(${index})">编辑</button>
                        <button class="btn-small secondary" onclick="metricsManager.previewMetric(${index})">预览</button>
                        <button class="btn-small danger" onclick="metricsManager.deleteMetric(${index})">删除</button>
                    </td>
                </tr>
            `;
        }).join('');

        // 卡片视图
        cardsContainer.innerHTML = this.metrics.map((metric, index) => {
            const dataSource = this.dataSources.find(ds => ds.id === metric.dataSourceId) || { name: '未知数据源' };
            return `
                <div class="metric-card">
                    <div class="metric-card-header">
                        <div class="metric-card-title">${metric.displayName}</div>
                        <div class="metric-card-actions">
                            <button class="btn-small primary" onclick="metricsManager.editMetric(${index})">编辑</button>
                            <button class="btn-small secondary" onclick="metricsManager.previewMetric(${index})">预览</button>
                        </div>
                    </div>
                    <div class="metric-card-content">
                        <p><strong>指标名称：</strong>${metric.name}</p>
                        <p><strong>数据源：</strong>${dataSource.name}</p>
                        <p><strong>计算方式：</strong>${metric.calculationType === 'basic' ? '基础计算' : '自定义计算'}</p>
                        <p><strong>公式：</strong><code>${metric.formula}</code></p>
                        <p><strong>描述：</strong>${metric.description || '无描述'}</p>
                    </div>
                </div>
            `;
        }).join('');
    }

    showCreateMetricModal() {
        document.getElementById('metricModalTitle').textContent = '创建指标';
        this.resetForm();
        document.getElementById('metricModal').classList.add('show');
        
        // 延迟绑定事件监听器，确保模态框DOM已完全加载
        setTimeout(() => {
            // 绑定数据源切换事件
            const dataSourceSelect = document.getElementById('metricDataSource');
            const tableSelect = document.getElementById('metricTable');
            
            if (dataSourceSelect) {
                // 移除可能存在的旧监听器
                const newDataSourceSelect = dataSourceSelect.cloneNode(true);
                dataSourceSelect.parentNode.replaceChild(newDataSourceSelect, dataSourceSelect);
                
                // 绑定新监听器
                newDataSourceSelect.addEventListener('change', () => this.loadDataSourceTables());
            }
            
            if (tableSelect) {
                // 移除可能存在的旧监听器
                const newTableSelect = tableSelect.cloneNode(true);
                tableSelect.parentNode.replaceChild(newTableSelect, tableSelect);
                
                // 绑定新监听器
                newTableSelect.addEventListener('change', () => this.loadTableFields());
            }
            
            // 确保数据源已加载并显示数据表选项
            this.loadDataSources();
            this.loadDataSourceTables();
        }, 100);
    }

    editMetric(index) {
        try {
            const metric = this.metrics[index];
            
            // 先显示模态框，确保DOM已加载
            document.getElementById('metricModal').classList.add('show');
            document.getElementById('metricModalTitle').textContent = '编辑指标';
            
            // 使用setTimeout确保DOM完全加载后再填充数据
            setTimeout(() => {
                // 填充表单数据
                const metricNameInput = document.getElementById('metricName');
                const metricDisplayNameInput = document.getElementById('metricDisplayName');
                const metricDataSourceInput = document.getElementById('metricDataSource');
                
                if (metricNameInput) metricNameInput.value = metric.name;
                if (metricDisplayNameInput) metricDisplayNameInput.value = metric.displayName;
                if (metricDataSourceInput) metricDataSourceInput.value = metric.dataSourceId;
            
            // 加载数据表选项
            this.loadDataSourceTables();
            
            // 设置计算方式
            const calculationType = metric.calculationType === 'basic' ? 'basic' : 'custom';
            document.querySelector(`input[name="calculationType"][value="${calculationType}"]`).checked = true;
            
            if (metric.calculationType === 'basic') {
                // 解析基础计算公式
                const match = metric.formula.match(/^(\w+)\((.*)\)$/);
                if (match) {
                    const functionMap = {
                        'SUM': 'sum',
                        'COUNT': 'count',
                        'AVG': 'avg',
                        'MAX': 'max',
                        'MIN': 'min',
                        'COUNT(DISTINCT)': 'distinct'
                    };
                    document.getElementById('basicCalculationType').value = functionMap[match[1]] || 'sum';
                }
            } else {
                document.getElementById('customFormula').value = metric.formula;
            }
            
            document.getElementById('metricDescription').value = metric.description || '';

            // 保存当前编辑的索引
            this.currentEditIndex = index;
            
            // 延迟加载数据表和字段，确保DOM已更新
            setTimeout(() => {
                // 尝试根据指标字段自动选择合适的数据表
                if (metric.selectedFields && metric.selectedFields.length > 0) {
                    const tableName = this.findTableWithFields(metric.selectedFields);
                    if (tableName) {
                        const metricTable = document.getElementById('metricTable');
                        if (metricTable) {
                            metricTable.value = tableName;
                            this.loadTableFields();
                            
                            // 延迟选中字段
                            setTimeout(() => {
                                this.selectFields(metric.selectedFields);
                            }, 100);
                        }
                    } else {
                        // 如果没有找到匹配的表，加载默认字段
                        this.loadTableFields();
                    }
                } else {
                    // 如果没有选中字段，加载默认字段
                    this.loadTableFields();
                }
            }, 100);
            
            this.toggleCalculationType();
            this.updateFormulaPreview();
            
            console.log('编辑指标成功:', metric);
            }, 100);
        } catch (error) {
            console.error('编辑指标时出错:', error);
            alert('编辑指标时出现错误，请刷新页面重试');
        }
    }

    // 查找包含指定字段的数据表
    findTableWithFields(fields) {
        const tableFields = this.getTableFields();
        for (const tableName in tableFields) {
            const tableFieldsArr = tableFields[tableName];
            const fieldNames = tableFieldsArr.map(f => f.name);
            if (fields.every(field => fieldNames.includes(field))) {
                return tableName;
            }
        }
        return null;
    }

    // 获取所有表字段数据
    getTableFields() {
        // 使用统一的数据配置文件
        return window.DataConfig?.tableFields || {};
    }

    // 选中指定的字段
    selectFields(fieldNames) {
        const availableFields = document.querySelectorAll('#availableFields .field-item');
        
        availableFields.forEach(fieldItem => {
            const fieldName = fieldItem.querySelector('.field-name').textContent;
            if (fieldNames.includes(fieldName)) {
                fieldItem.classList.add('selected');
            }
        });
        
        // 添加字段到已选区域
        this.addSelectedFields();
    }

    resetForm() {
        document.getElementById('metricName').value = '';
        document.getElementById('metricDisplayName').value = '';
        document.getElementById('metricDataSource').value = '';
        document.querySelector('input[name="calculationType"][value="basic"]').checked = true;
        document.getElementById('basicCalculationType').value = 'sum';
        document.getElementById('customFormula').value = '';
        document.getElementById('metricDescription').value = '';
        
        // 清空已选字段
        const availableFieldsContainer = document.getElementById('availableFields');
        const selectedFieldsContainer = document.getElementById('selectedFields');
        const calculationFieldsContainer = document.getElementById('calculationFieldsContainer');
        
        availableFieldsContainer.innerHTML = '<div class="no-fields">请先选择数据表以加载字段</div>';
        selectedFieldsContainer.innerHTML = '<div class="no-fields">暂无选中字段</div>';
        calculationFieldsContainer.innerHTML = '<div class="no-fields">请先选择字段</div>';
        
        this.currentEditIndex = null;
        this.toggleCalculationType();
        this.updateFormulaPreview();
    }

    saveMetric() {
        const name = document.getElementById('metricName').value.trim();
        const displayName = document.getElementById('metricDisplayName').value.trim();
        const dataSourceId = parseInt(document.getElementById('metricDataSource').value);
        const calculationType = document.querySelector('input[name="calculationType"]:checked').value;
        const description = document.getElementById('metricDescription').value.trim();
        
        if (!name || !displayName || !dataSourceId) {
            alert('请填写必填字段（指标名称、显示名称、数据源）');
            return;
        }

        let formula = '';
        
        if (calculationType === 'basic') {
            const calcType = document.getElementById('basicCalculationType').value;
            const selectedFields = this.getSelectedFields();
            
            if (selectedFields.length === 0) {
                alert('请先选择计算字段');
                return;
            }
            
            const functionMap = {
                'sum': 'SUM',
                'count': 'COUNT',
                'avg': 'AVG',
                'max': 'MAX',
                'min': 'MIN',
                'distinct': 'COUNT(DISTINCT)'
            };
            
            // 支持多字段计算
            if (selectedFields.length === 1) {
                formula = `${functionMap[calcType]}(${selectedFields[0]})`;
            } else {
                // 多字段计算示例
                if (calcType === 'avg') {
                    formula = `${functionMap['sum']}(${selectedFields[0]}) / ${functionMap['count']}(${selectedFields[1]})`;
                } else if (calcType === 'distinct') {
                    formula = `${functionMap['count']}(DISTINCT ${selectedFields.join(', ')})`;
                } else {
                    formula = `${functionMap[calcType]}(${selectedFields.join(' + ')})`;
                }
            }
        } else {
            formula = document.getElementById('customFormula').value.trim();
            if (!formula) {
                alert('请输入自定义公式');
                return;
            }
        }

        const metric = {
            id: this.currentEditIndex !== null ? this.metrics[this.currentEditIndex].id : Date.now(),
            name,
            displayName,
            dataSourceId,
            calculationType,
            formula,
            description,
            selectedFields: calculationType === 'basic' ? this.getSelectedFields() : [],
            createdAt: this.currentEditIndex !== null ? this.metrics[this.currentEditIndex].createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (this.currentEditIndex !== null) {
            // 更新现有指标
            this.metrics[this.currentEditIndex] = metric;
        } else {
            // 添加新指标
            this.metrics.push(metric);
        }

        this.loadMetrics();
        this.closeMetricModal();
        
        alert(this.currentEditIndex !== null ? '指标更新成功' : '指标创建成功');
    }

    deleteMetric(index) {
        if (confirm('确定要删除这个指标吗？')) {
            this.metrics.splice(index, 1);
            this.loadMetrics();
            alert('指标删除成功');
        }
    }

    previewMetric(index) {
        const metric = this.metrics[index];
        alert(`指标预览:\n名称: ${metric.displayName}\n公式: ${metric.formula}\n描述: ${metric.description}`);
    }

    filterMetrics() {
        const searchTerm = document.getElementById('searchMetric').value.toLowerCase();
        const dataSourceFilter = document.getElementById('filterDataSource').value;
        
        const rows = document.querySelectorAll('#metricList tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const dataSourceMatch = !dataSourceFilter || 
                row.textContent.includes(this.dataSources.find(ds => ds.id == dataSourceFilter)?.name || '');
            
            row.style.display = text.includes(searchTerm) && dataSourceMatch ? '' : 'none';
        });
    }

    quickCreateRevenue() {
        document.getElementById('metricModalTitle').textContent = '快速创建 - 收入指标';
        this.resetForm();
        
        // 预填充收入相关指标
        document.getElementById('metricName').value = 'total_revenue';
        document.getElementById('metricDisplayName').value = '总收入';
        document.getElementById('basicCalculationType').value = 'sum';
        document.getElementById('calculationField').value = 'amount';
        document.getElementById('metricDescription').value = '计算所有订单的总收入金额';
        
        this.updateFormulaPreview();
        document.getElementById('metricModal').classList.add('show');
        this.closeQuickCreateModal();
    }

    quickCreateUser() {
        document.getElementById('metricModalTitle').textContent = '快速创建 - 用户指标';
        this.resetForm();
        
        // 预填充用户相关指标
        document.getElementById('metricName').value = 'active_users';
        document.getElementById('metricDisplayName').value = '活跃用户数';
        document.getElementById('basicCalculationType').value = 'distinct';
        document.getElementById('calculationField').value = 'user_id';
        document.getElementById('metricDescription').value = '计算活跃用户数量';
        
        this.updateFormulaPreview();
        document.getElementById('metricModal').classList.add('show');
        this.closeQuickCreateModal();
    }

    closeMetricModal() {
        document.getElementById('metricModal').classList.remove('show');
    }

    closeQuickCreateModal() {
        document.getElementById('quickCreateModal').classList.remove('show');
    }



    // 快速创建示例指标
    createSampleMetrics() {
        // 重置为配置中的指标数据
        this.metrics = this.loadMetricsFromConfig();

        this.loadMetrics();
        alert('示例指标创建成功！');
    }
}

// 初始化指标管理器
const metricsManager = new MetricsManager();

// 全局函数供HTML调用
function showCreateMetricModal() {
    metricsManager.showCreateMetricModal();
}

function closeMetricModal() {
    metricsManager.closeMetricModal();
}

function closeQuickCreateModal() {
    metricsManager.closeQuickCreateModal();
}

function toggleCalculationType() {
    metricsManager.toggleCalculationType();
}

function updateFormulaPreview() {
    metricsManager.updateFormulaPreview();
}

function loadDataSourceTables() {
    metricsManager.loadDataSourceTables();
}

function loadTableFields() {
    metricsManager.loadTableFields();
}

function addSelectedFields() {
    metricsManager.addSelectedFields();
}

function saveMetric() {
    metricsManager.saveMetric();
}

function filterMetrics() {
    metricsManager.filterMetrics();
}

function quickCreateRevenue() {
    metricsManager.quickCreateRevenue();
}

function quickCreateUser() {
    metricsManager.quickCreateUser();
}