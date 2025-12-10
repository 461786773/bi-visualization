// 维度配置逻辑
class DimensionsManager {
    constructor() {

        this.dimensions = this.loadDimensionsFromConfig();
        // 使用统一的数据配置文件
        this.dataSources = window.DataConfig?.dataSources || [];
        this.init();
    }
    
    // 从dataConfig中加载维度
    loadDimensionsFromConfig() {
        // 如果dataConfig中有维度数据，直接使用
        if (window.DataConfig?.dimensions) {
            return window.DataConfig.dimensions;
        }
        
        // 否则创建示例维度
        return [
            {
                id: 1,
                name: 'event_timestamp',
                displayName: '安全事件时间',
                type: 'time',
                dataSourceId: 1, // 车辆安全监控数据源
                field: 'timestamp',
                hierarchyType: 'flat',
                config: {
                    timeFormat: 'datetime',
                    timeGranularity: 'hour'
                },
                description: '安全事件发生时间维度',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 2,
                name: 'security_level',
                displayName: '安全等级',
                type: 'business',
                dataSourceId: 1, // 车辆安全监控数据源
                field: 'security_level',
                hierarchyType: 'flat',
                config: {},
                description: '车辆安全等级维度',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 3,
                name: 'vehicle_id',
                displayName: '车辆编号',
                type: 'business',
                dataSourceId: 1, // 车辆安全监控数据源
                field: 'vehicle_id',
                hierarchyType: 'flat',
                config: {},
                description: '车辆唯一标识维度',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 4,
                name: 'incident_type',
                displayName: '事件类型',
                type: 'business',
                dataSourceId: 2, // 网络安全事件数据源
                field: 'incident_type',
                hierarchyType: 'flat',
                config: {},
                description: '安全事件类型维度',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 5,
                name: 'source_ip',
                displayName: '源IP地址',
                type: 'business',
                dataSourceId: 2, // 网络安全事件数据源
                field: 'source_ip',
                hierarchyType: 'flat',
                config: {},
                description: '攻击来源IP维度',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 6,
                name: 'cpu_usage',
                displayName: 'CPU使用率',
                type: 'time',
                dataSourceId: 3, // 系统运行状态数据源
                field: 'cpu_usage',
                hierarchyType: 'flat',
                config: {
                    timeFormat: 'number',
                    timeGranularity: 'minute'
                },
                description: '系统CPU使用率时间维度',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
    }

    init() {
        this.loadDimensions();
        this.loadDataSources();
        // 延迟执行事件监听器设置，确保DOM完全加载
        setTimeout(() => {
            this.setupEventListeners();
        }, 100);
    }

    setupEventListeners() {
        // 维度类型切换
        const dimensionTypeElement = document.getElementById('dimensionType');
        if (dimensionTypeElement) {
            dimensionTypeElement.addEventListener('change', () => this.toggleDimensionFields());
        }
        
        // 层级类型切换
        const hierarchyRadios = document.querySelectorAll('input[name="hierarchyType"]');
        if (hierarchyRadios.length > 0) {
            hierarchyRadios.forEach(radio => {
                radio.addEventListener('change', () => this.toggleHierarchyFields());
            });
        }

        // 数据源切换
        const dataSourceElement = document.getElementById('dimensionDataSource');
        if (dataSourceElement) {
            dataSourceElement.addEventListener('change', () => this.loadDimensionTables());
        }

        // 搜索功能
        const searchElement = document.getElementById('searchDimension');
        if (searchElement) {
            searchElement.addEventListener('input', () => this.filterDimensions());
        }
        
        const filterElement = document.getElementById('filterDimensionType');
        if (filterElement) {
            filterElement.addEventListener('change', () => this.filterDimensions());
        }

        // 模态框关闭事件监听器
        this.setupModalCloseListeners();
    }

    // 设置模态框关闭事件监听器
    setupModalCloseListeners() {
        // 维度模态框关闭按钮
        const closeDimensionModalBtn = document.getElementById('closeDimensionModalBtn');
        if (closeDimensionModalBtn) {
            closeDimensionModalBtn.addEventListener('click', () => this.closeDimensionModal());
        }
        
        // 取消按钮
        const cancelDimensionBtn = document.getElementById('cancelDimensionBtn');
        if (cancelDimensionBtn) {
            cancelDimensionBtn.addEventListener('click', () => this.closeDimensionModal());
        }
        
        // 预览模态框关闭按钮
        const closeDimensionPreviewModalBtn = document.getElementById('closeDimensionPreviewModalBtn');
        if (closeDimensionPreviewModalBtn) {
            closeDimensionPreviewModalBtn.addEventListener('click', () => this.closeDimensionPreviewModal());
        }
        
        // 模态框背景点击关闭
        const dimensionModal = document.getElementById('dimensionModal');
        const dimensionPreviewModal = document.getElementById('dimensionPreviewModal');
        
        if (dimensionModal) {
            dimensionModal.addEventListener('click', (e) => {
                if (e.target === dimensionModal) {
                    this.closeDimensionModal();
                }
            });
        }
        
        if (dimensionPreviewModal) {
            dimensionPreviewModal.addEventListener('click', (e) => {
                if (e.target === dimensionPreviewModal) {
                    this.closeDimensionPreviewModal();
                }
            });
        }
    }

    loadDataSources() {
        const dataSourceSelect = document.getElementById('dimensionDataSource');
        
        if (!dataSourceSelect) {
            console.error('维度数据源选择器未找到');
            return;
        }
        
        // 清空选项（保留第一个选项）
        while (dataSourceSelect.children.length > 1) {
            dataSourceSelect.removeChild(dataSourceSelect.lastChild);
        }

        // 添加数据源选项
        this.dataSources.forEach(ds => {
            const option = document.createElement('option');
            option.value = ds.id;
            option.textContent = ds.name;
            dataSourceSelect.appendChild(option);
        });
    }

    bindModalEventListeners() {
        // 重新绑定模态框内的事件监听器，确保DOM完全加载
        const dimensionTypeElement = document.getElementById('dimensionType');
        if (dimensionTypeElement) {
            dimensionTypeElement.removeEventListener('change', this.toggleDimensionFields);
            dimensionTypeElement.addEventListener('change', () => this.toggleDimensionFields());
        }
        
        const hierarchyRadios = document.querySelectorAll('input[name="hierarchyType"]');
        if (hierarchyRadios.length > 0) {
            hierarchyRadios.forEach(radio => {
                radio.removeEventListener('change', this.toggleHierarchyFields);
                radio.addEventListener('change', () => this.toggleHierarchyFields());
            });
        }

        const dataSourceElement = document.getElementById('dimensionDataSource');
        if (dataSourceElement) {
            dataSourceElement.removeEventListener('change', this.loadDimensionTables);
            dataSourceElement.addEventListener('change', () => this.loadDimensionTables());
        }
    }

    bindModalEventListeners() {
        // 重新绑定模态框内的事件监听器，确保DOM完全加载
        const dimensionTypeElement = document.getElementById('dimensionType');
        if (dimensionTypeElement) {
            dimensionTypeElement.removeEventListener('change', this.toggleDimensionFields);
            dimensionTypeElement.addEventListener('change', () => this.toggleDimensionFields());
        }
        
        const hierarchyRadios = document.querySelectorAll('input[name="hierarchyType"]');
        if (hierarchyRadios.length > 0) {
            hierarchyRadios.forEach(radio => {
                radio.removeEventListener('change', this.toggleHierarchyFields);
                radio.addEventListener('change', () => this.toggleHierarchyFields());
            });
        }

        const dataSourceElement = document.getElementById('dimensionDataSource');
        if (dataSourceElement) {
            dataSourceElement.removeEventListener('change', this.loadDimensionTables);
            dataSourceElement.addEventListener('change', () => this.loadDimensionTables());
        }
    }

    loadDimensionTables() {
        const dataSourceId = document.getElementById('dimensionDataSource').value;
        const tableSelect = document.getElementById('dimensionTable');
        
        // 清空选项
        tableSelect.innerHTML = '<option value="">请选择数据表</option>';

        if (!dataSourceId) return;

        // 使用统一的数据配置文件
        const dataSourceTables = window.DataConfig?.dataSourceTables || {};
        
        // 确保 dataSourceId 是字符串类型
        const dataSourceIdStr = String(dataSourceId);
        const tables = dataSourceTables[dataSourceIdStr] || [
            { value: 'sample_table', text: '示例数据表 - 通用示例数据 (sample_table)' }
        ];

        tables.forEach(table => {
            const option = document.createElement('option');
            option.value = table.value;
            option.textContent = table.text;
            tableSelect.appendChild(option);
        });

        // 为数据表选择框添加change事件，选择数据表后加载字段
        tableSelect.removeEventListener('change', this.loadTableFields);
        tableSelect.addEventListener('change', () => this.loadTableFields());
    }

    loadTableFields() {
        const tableSelect = document.getElementById('dimensionTable');
        const fieldSelect = document.getElementById('dimensionField');
        const selectedTable = tableSelect.value;
        
        // 清空字段选项
        fieldSelect.innerHTML = '<option value="">请选择字段</option>';
        
        if (!selectedTable) return;

        // 使用统一的数据配置文件中的维度字段定义
        const dimensionFields = window.DataConfig?.dimensionFields || {};
        
        const fields = dimensionFields[selectedTable] || [
            { value: 'date_field', text: '日期字段 (date_field)' },
            { value: 'category_field', text: '类别字段 (category_field)' },
            { value: 'region_field', text: '地区字段 (region_field)' }
        ];

        fields.forEach(field => {
            const option = document.createElement('option');
            option.value = field.value;
            option.textContent = field.text;
            fieldSelect.appendChild(option);
        });
    }

    loadTableFields() {
        const tableSelect = document.getElementById('dimensionTable');
        const fieldSelect = document.getElementById('dimensionField');
        const selectedTable = tableSelect.value;
        
        // 清空字段选项
        fieldSelect.innerHTML = '<option value="">请选择字段</option>';
        
        if (!selectedTable) return;

        // 使用统一的数据配置文件中的维度字段定义
        const dimensionFields = window.DataConfig?.dimensionFields || {};
        
        const fields = dimensionFields[selectedTable] || [
            { value: 'date_field', text: '日期字段 (date_field)' },
            { value: 'category_field', text: '类别字段 (category_field)' },
            { value: 'region_field', text: '地区字段 (region_field)' }
        ];

        fields.forEach(field => {
            const option = document.createElement('option');
            option.value = field.value;
            option.textContent = field.text;
            fieldSelect.appendChild(option);
        });
    }

    toggleDimensionFields() {
        const type = document.getElementById('dimensionType').value;
        
        // 隐藏所有配置区域
        document.getElementById('timeDimensionConfig').style.display = 'none';
        document.getElementById('geoDimensionConfig').style.display = 'none';

        // 显示对应的配置区域
        if (type === 'time') {
            document.getElementById('timeDimensionConfig').style.display = 'block';
        } else if (type === 'geography') {
            document.getElementById('geoDimensionConfig').style.display = 'block';
        }
        
        // 显示维度类型说明
        this.showDimensionTypeDescription(type);
    }

    showDimensionTypeDescription(type) {
        const descriptions = {
            'time': '📅 时间维度：适用于趋势分析、时间序列图表（线图、柱状图等）\n• 支持日期、时间、年、月、季度等时间格式\n• 用于显示数据随时间的变化趋势',
            'business': '📊 业务维度：适用于分类统计、对比分析（饼图、柱状图等）\n• 支持平级和层级结构\n• 用于比较不同类别之间的数据差异',
            'geography': '🗺️ 地理维度：适用于地图可视化、区域分布分析\n• 支持国家、省份、城市等地理层级\n• 用于展示数据的空间分布特征',
            'other': '🔧 其他维度：通用维度类型，适用于各种自定义分析场景'
        };
        
        // 创建或更新说明区域
        let descriptionElement = document.getElementById('dimensionTypeDescription');
        if (!descriptionElement) {
            descriptionElement = document.createElement('div');
            descriptionElement.id = 'dimensionTypeDescription';
            descriptionElement.className = 'dimension-type-description';
            document.getElementById('dimensionType').parentNode.appendChild(descriptionElement);
        }
        
        descriptionElement.innerHTML = `<div class="type-description">${descriptions[type] || ''}</div>`;
    }

    toggleHierarchyFields() {
        const hierarchyType = document.querySelector('input[name="hierarchyType"]:checked').value;
        const hierarchyFields = document.getElementById('hierarchyFields');
        
        if (hierarchyType === 'hierarchy') {
            hierarchyFields.style.display = 'block';
        } else {
            hierarchyFields.style.display = 'none';
        }
    }

    loadDimensions() {
        const tbody = document.getElementById('dimensionList');
        const timeDimensions = document.getElementById('timeDimensions');
        const businessDimensions = document.getElementById('businessDimensions');
        const geoDimensions = document.getElementById('geoDimensions');
        
        if (this.dimensions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px;">暂无维度，点击"创建维度"开始添加</td></tr>';
            timeDimensions.innerHTML = '<div class="empty-state">暂无时间维度</div>';
            businessDimensions.innerHTML = '<div class="empty-state">暂无业务维度</div>';
            geoDimensions.innerHTML = '<div class="empty-state">暂无地理维度</div>';
            return;
        }

        // 表格视图
        tbody.innerHTML = this.dimensions.map((dimension, index) => {
            const dataSource = this.dataSources.find(ds => ds.id === dimension.dataSourceId) || { name: '未知数据源' };
            return `
                <tr>
                    <td>${dimension.name}</td>
                    <td>${dimension.displayName}</td>
                    <td>${this.getDimensionTypeText(dimension.type)}</td>
                    <td>${dataSource.name}</td>
                    <td>${dimension.field}</td>
                    <td>${dimension.hierarchyType === 'hierarchy' ? '层级维度' : '平级维度'}</td>
                    <td class="action-buttons">
                        <button class="btn-small primary" onclick="dimensionsManager.editDimension(${index})">编辑</button>
                        <button class="btn-small secondary" onclick="dimensionsManager.previewDimension(${index})">预览</button>
                        <button class="btn-small danger" onclick="dimensionsManager.deleteDimension(${index})">删除</button>
                    </td>
                </tr>
            `;
        }).join('');

        // 分组卡片视图
        const timeDims = this.dimensions.filter(d => d.type === 'time');
        const businessDims = this.dimensions.filter(d => d.type === 'business');
        const geoDims = this.dimensions.filter(d => d.type === 'geography');
        
        timeDimensions.innerHTML = timeDims.map((dimension, index) => this.createDimensionCard(dimension, index)).join('') || 
            '<div class="empty-state">暂无时间维度</div>';
        
        businessDimensions.innerHTML = businessDims.map((dimension, index) => this.createDimensionCard(dimension, index)).join('') || 
            '<div class="empty-state">暂无业务维度</div>';
        
        geoDimensions.innerHTML = geoDims.map((dimension, index) => this.createDimensionCard(dimension, index)).join('') || 
            '<div class="empty-state">暂无地理维度</div>';
    }

    createDimensionCard(dimension, index) {
        const dataSource = this.dataSources.find(ds => ds.id === dimension.dataSourceId) || { name: '未知数据源' };
        const iconMap = {
            'time': '📅',
            'business': '🏢',
            'geography': '🌍',
            'other': '📊'
        };

        return `
            <div class="card">
                <div class="card-title">
                    <span>${iconMap[dimension.type]}</span>
                    ${dimension.displayName}
                </div>
                <div class="card-content">
                    <p><strong>字段：</strong>${dimension.field}</p>
                    <p><strong>数据源：</strong>${dataSource.name}</p>
                    <p><strong>层级：</strong>${dimension.hierarchyType === 'hierarchy' ? '层级维度' : '平级维度'}</p>
                    ${dimension.type === 'time' ? `<p><strong>粒度：</strong>${dimension.config?.timeGranularity || '天'}</p>` : ''}
                    ${dimension.type === 'geography' ? `<p><strong>层级：</strong>${dimension.config?.geoLevel || '城市'}</p>` : ''}
                </div>
                <div class="card-actions">
                    <button class="btn btn-primary" onclick="dimensionsManager.useDimension(${index})">使用此维度</button>
                    <button class="btn btn-secondary" onclick="dimensionsManager.editDimension(${index})">编辑配置</button>
                </div>
            </div>
        `;
    }

    getDimensionTypeText(type) {
        const typeMap = {
            'time': '时间维度',
            'business': '业务维度',
            'geography': '地理维度',
            'other': '其他维度'
        };
        return typeMap[type] || type;
    }

    showCreateDimensionModal() {
        document.getElementById('dimensionModalTitle').textContent = '创建维度';
        this.resetForm();
        // 在模态框显示后重新绑定事件监听器，确保DOM完全加载
        setTimeout(() => {
            this.bindModalEventListeners();
        }, 0);
        document.getElementById('dimensionModal').classList.add('show');
    }

    editDimension(index) {
        const dimension = this.dimensions[index];
        document.getElementById('dimensionModalTitle').textContent = '编辑维度';
        
        // 填充表单数据
        document.getElementById('dimensionName').value = dimension.name;
        document.getElementById('dimensionDisplayName').value = dimension.displayName;
        document.getElementById('dimensionType').value = dimension.type;
        document.getElementById('dimensionDataSource').value = dimension.dataSourceId;
        document.getElementById('dimensionField').value = dimension.field;
        
        // 设置层级类型
        document.querySelector(`input[name="hierarchyType"][value="${dimension.hierarchyType}"]`).checked = true;
        
        // 设置配置
        if (dimension.type === 'time') {
            document.getElementById('timeFormat').value = dimension.config?.timeFormat || 'date';
            document.getElementById('timeGranularity').value = dimension.config?.timeGranularity || 'day';
        } else if (dimension.type === 'geography') {
            document.getElementById('geoLevel').value = dimension.config?.geoLevel || 'city';
        }
        
        if (dimension.hierarchyType === 'hierarchy') {
            document.getElementById('hierarchyFieldsInput').value = dimension.config?.hierarchyFields || '';
        }
        
        document.getElementById('dimensionDescription').value = dimension.description || '';

        // 保存当前编辑的索引
        this.currentEditIndex = index;
        
        this.toggleDimensionFields();
        this.toggleHierarchyFields();
        
        // 在模态框显示后重新绑定事件监听器，确保DOM完全加载
        setTimeout(() => {
            this.bindModalEventListeners();
        }, 0);
        document.getElementById('dimensionModal').classList.add('show');
    }

    resetForm() {
        document.getElementById('dimensionName').value = '';
        document.getElementById('dimensionDisplayName').value = '';
        document.getElementById('dimensionType').value = 'time';
        document.getElementById('dimensionDataSource').value = '';
        document.getElementById('dimensionTable').value = '';
        document.getElementById('dimensionField').value = '';
        document.querySelector('input[name="hierarchyType"][value="flat"]').checked = true;
        document.getElementById('timeFormat').value = 'date';
        document.getElementById('timeGranularity').value = 'day';
        document.getElementById('geoLevel').value = 'city';
        document.getElementById('hierarchyFieldsInput').value = '';
        document.getElementById('dimensionDescription').value = '';
        
        this.currentEditIndex = null;
        this.toggleDimensionFields();
        this.toggleHierarchyFields();
        
        // 显示默认的维度类型说明
        this.showDimensionTypeDescription('time');
    }

    saveDimension() {
        const name = document.getElementById('dimensionName').value.trim();
        const displayName = document.getElementById('dimensionDisplayName').value.trim();
        const type = document.getElementById('dimensionType').value;
        const dataSourceId = parseInt(document.getElementById('dimensionDataSource').value);
        const field = document.getElementById('dimensionField').value.trim();
        const hierarchyType = document.querySelector('input[name="hierarchyType"]:checked').value;
        const description = document.getElementById('dimensionDescription').value.trim();
        
        if (!name || !displayName || !dataSourceId || !field) {
            alert('请填写必填字段（维度名称、显示名称、数据源、维度字段）');
            return;
        }

        const config = {};
        
        if (type === 'time') {
            config.timeFormat = document.getElementById('timeFormat').value;
            config.timeGranularity = document.getElementById('timeGranularity').value;
        } else if (type === 'geography') {
            config.geoLevel = document.getElementById('geoLevel').value;
        }
        
        if (hierarchyType === 'hierarchy') {
            const hierarchyFields = document.getElementById('hierarchyFieldsInput').value.trim();
            if (!hierarchyFields) {
                alert('请输入层级字段');
                return;
            }
            config.hierarchyFields = hierarchyFields;
        }

        const dimension = {
            id: this.currentEditIndex !== null ? this.dimensions[this.currentEditIndex].id : Date.now(),
            name,
            displayName,
            type,
            dataSourceId,
            field,
            hierarchyType,
            config,
            description,
            createdAt: this.currentEditIndex !== null ? this.dimensions[this.currentEditIndex].createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (this.currentEditIndex !== null) {
            // 更新现有维度
            this.dimensions[this.currentEditIndex] = dimension;
        } else {
            // 添加新维度
            this.dimensions.push(dimension);
        }

        this.loadDimensions();
        this.closeDimensionModal();
        
        alert(this.currentEditIndex !== null ? '维度更新成功' : '维度创建成功');
    }

    deleteDimension(index) {
        if (confirm('确定要删除这个维度吗？')) {
            this.dimensions.splice(index, 1);
            this.loadDimensions();
            alert('维度删除成功');
        }
    }

    previewDimension(index) {
        const dimension = this.dimensions[index];
        document.getElementById('dimensionPreviewTitle').textContent = `维度预览 - ${dimension.displayName}`;
        
        let previewContent = `
            <div class="preview-info">
                <p><strong>名称：</strong>${dimension.name}</p>
                <p><strong>显示名称：</strong>${dimension.displayName}</p>
                <p><strong>类型：</strong>${this.getDimensionTypeText(dimension.type)}</p>
                <p><strong>字段：</strong>${dimension.field}</p>
                <p><strong>层级类型：</strong>${dimension.hierarchyType === 'hierarchy' ? '层级维度' : '平级维度'}</p>
                <p><strong>描述：</strong>${dimension.description || '无描述'}</p>
            </div>
            <div class="preview-sample">
                <h4>示例数据</h4>
                <div class="sample-data">
        `;

        // 生成示例数据
        if (dimension.type === 'time') {
            previewContent += `
                <p>2024-01-01</p>
                <p>2024-01-02</p>
                <p>2024-01-03</p>
                <p>...</p>
            `;
        } else if (dimension.type === 'geography') {
            previewContent += `
                <p>北京市</p>
                <p>上海市</p>
                <p>广州市</p>
                <p>...</p>
            `;
        } else {
            previewContent += `
                <p>类别A</p>
                <p>类别B</p>
                <p>类别C</p>
                <p>...</p>
            `;
        }

        previewContent += '</div></div>';
        
        document.getElementById('dimensionPreviewContent').innerHTML = previewContent;
        document.getElementById('dimensionPreviewModal').classList.add('show');
    }

    useDimension(index) {
        const dimension = this.dimensions[index];
        alert(`已选择维度: ${dimension.displayName}`);
        // 这里可以跳转到数据卡片页面，并传递维度信息
        window.location.href = `datacards.html?dimensionId=${dimension.id}`;
    }

    filterDimensions() {
        const searchTerm = document.getElementById('searchDimension').value.toLowerCase();
        const typeFilter = document.getElementById('filterDimensionType').value;
        
        const rows = document.querySelectorAll('#dimensionList tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const typeMatch = !typeFilter || 
                row.textContent.includes(this.getDimensionTypeText(typeFilter));
            
            row.style.display = text.includes(searchTerm) && typeMatch ? '' : 'none';
        });
    }

    closeDimensionModal() {
        document.getElementById('dimensionModal').classList.remove('show');
    }

    closeDimensionPreviewModal() {
        document.getElementById('dimensionPreviewModal').classList.remove('show');
    }


}

// 初始化维度管理器
const dimensionsManager = new DimensionsManager();

// 全局函数供HTML调用
function showCreateDimensionModal() {
    dimensionsManager.showCreateDimensionModal();
}

function closeDimensionModal() {
    dimensionsManager.closeDimensionModal();
}

function closeDimensionPreviewModal() {
    dimensionsManager.closeDimensionPreviewModal();
}

function toggleDimensionFields() {
    dimensionsManager.toggleDimensionFields();
}

function toggleHierarchyFields() {
    dimensionsManager.toggleHierarchyFields();
}

function loadDimensionTables() {
    dimensionsManager.loadDimensionTables();
}

function saveDimension() {
    dimensionsManager.saveDimension();
}

function filterDimensions() {
    dimensionsManager.filterDimensions();
}