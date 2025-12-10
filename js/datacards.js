// 数据卡片管理逻辑 - 优化版本
class DataCardsManager {
    constructor() {
        // 延迟初始化，避免阻塞页面渲染
        this.dataCards = [];
        this.metrics = [];
        this.dimensions = [];
        this.dataSources = [];
        this.isInitialized = false;
        
        // 同步初始化，避免异步问题
        this.initSync();
    }
    
    // 同步初始化
    initSync() {
        // 简化初始化逻辑，避免复杂等待
        try {
            // 直接使用数据配置，不等待
            this.dataCards = this.loadDataCardsFromConfig();
            this.metrics = this.loadMetricsFromConfig();
            this.dimensions = this.loadDimensionsFromConfig();
            this.dataSources = window.DataConfig?.dataSources || [];
            
            console.log('数据卡片管理器初始化成功');
        } catch (error) {
            console.error('数据卡片管理器初始化失败:', error);
            // 初始化失败时使用空数据
            this.dataCards = [];
            this.metrics = [];
            this.dimensions = [];
            this.dataSources = [];
        }
        
        // 设置最小可用状态
        this.isInitialized = true;
        this.init();
        
        console.log('数据卡片管理器同步初始化完成');
    }
    
    // 从dataConfig中加载数据卡片
    loadDataCardsFromConfig() {
        return window.DataConfig?.dataCards || [];
    }
    
    // 从dataConfig中加载指标
    loadMetricsFromConfig() {
        return window.DataConfig?.metrics || [];
    }
    
    // 从dataConfig中加载维度
    loadDimensionsFromConfig() {
        return window.DataConfig?.dimensions || [];
    }

    init() {
        this.loadDataCards();
        this.loadMetricsAndDimensions();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // 卡片类型切换
        document.getElementById('dataCardType').addEventListener('change', () => this.toggleDataCardConfig());
        
        // 指标选择
        document.getElementById('dataCardMetric').addEventListener('change', () => this.loadMetricDimensions());
        
        // 关闭模态框事件监听器
        this.setupModalCloseListeners();
    }
    
    // 设置模态框关闭事件监听器
    setupModalCloseListeners() {
        // 创建数据卡片模态框关闭按钮
        const closeDataCardModalBtn = document.getElementById('closeDataCardModalBtn');
        if (closeDataCardModalBtn) {
            closeDataCardModalBtn.addEventListener('click', () => this.closeDataCardModal());
        }
        
        // 取消按钮
        const cancelDataCardBtn = document.getElementById('cancelDataCardBtn');
        if (cancelDataCardBtn) {
            cancelDataCardBtn.addEventListener('click', () => this.closeDataCardModal());
        }
        
        // 预览模态框关闭按钮
        const closeDataCardPreviewModalBtn = document.getElementById('closeDataCardPreviewModalBtn');
        if (closeDataCardPreviewModalBtn) {
            closeDataCardPreviewModalBtn.addEventListener('click', () => this.closeDataCardPreviewModal());
        }
        
        // 模态框背景点击关闭
        const dataCardModal = document.getElementById('dataCardModal');
        const dataCardPreviewModal = document.getElementById('dataCardPreviewModal');
        
        if (dataCardModal) {
            dataCardModal.addEventListener('click', (e) => {
                if (e.target === dataCardModal) {
                    this.closeDataCardModal();
                }
            });
        }
        
        if (dataCardPreviewModal) {
            dataCardPreviewModal.addEventListener('click', (e) => {
                if (e.target === dataCardPreviewModal) {
                    this.closeDataCardPreviewModal();
                }
            });
        }
    }

    loadMetricsAndDimensions() {
        const metricSelect = document.getElementById('dataCardMetric');
        const tableMetricsSelect = document.getElementById('tableMetrics');
        const dimensionSelect = document.getElementById('dataCardDimension');
        const mapDimensionSelect = document.getElementById('mapDimension');
        
        // 清空选项（保留第一个选项）
        while (metricSelect.children.length > 1) {
            metricSelect.removeChild(metricSelect.lastChild);
        }
        if (tableMetricsSelect) {
            while (tableMetricsSelect.children.length > 1) {
                tableMetricsSelect.removeChild(tableMetricsSelect.lastChild);
            }
        }
        while (dimensionSelect.children.length > 1) {
            dimensionSelect.removeChild(dimensionSelect.lastChild);
        }
        while (mapDimensionSelect.children.length > 1) {
            mapDimensionSelect.removeChild(mapDimensionSelect.lastChild);
        }

        // 添加指标选项
        this.metrics.forEach(metric => {
            const option = document.createElement('option');
            option.value = metric.id;
            option.textContent = metric.displayName;
            metricSelect.appendChild(option);
        });
        
        // 为表格多选添加选项（独立添加）
        if (tableMetricsSelect) {
            this.metrics.forEach(metric => {
                const tableOption = document.createElement('option');
                tableOption.value = metric.id;
                tableOption.textContent = metric.displayName;
                tableMetricsSelect.appendChild(tableOption);
            });
        }

        // 添加维度选项
        this.dimensions.forEach(dimension => {
            const option = document.createElement('option');
            option.value = dimension.id;
            option.textContent = dimension.displayName;
            dimensionSelect.appendChild(option);
            
            // 为地图添加地理维度
            if (dimension.type === 'geography') {
                const mapOption = document.createElement('option');
                mapOption.value = dimension.id;
                mapOption.textContent = dimension.displayName;
                mapDimensionSelect.appendChild(mapOption);
            }
        });
    }

    loadMetricDimensions() {
        const metricId = parseInt(document.getElementById('dataCardMetric').value);
        const dimensionSelect = document.getElementById('dataCardDimension');
        const dimensionInfo = document.getElementById('dimensionCompatibilityInfo');
        
        if (!metricId) {
            // 清空选项和提示信息
            while (dimensionSelect.children.length > 1) {
                dimensionSelect.removeChild(dimensionSelect.lastChild);
            }
            if (dimensionInfo) dimensionInfo.style.display = 'none';
            return;
        }

        // 获取指标对应的数据源
        const metric = this.metrics.find(m => m.id === metricId);
        if (!metric) return;

        // 清空选项（保留第一个选项）
        while (dimensionSelect.children.length > 1) {
            dimensionSelect.removeChild(dimensionSelect.lastChild);
        }

        // 添加与指标数据源匹配的维度
        const compatibleDimensions = this.dimensions.filter(d => d.dataSourceId === metric.dataSourceId);
        const incompatibleDimensions = this.dimensions.filter(d => d.dataSourceId !== metric.dataSourceId);
        
        // 显示兼容性信息
        if (dimensionInfo) {
            if (compatibleDimensions.length > 0) {
                dimensionInfo.innerHTML = `<span style="color: #52c41a;">✅ 找到 ${compatibleDimensions.length} 个兼容维度</span>`;
            } else {
                dimensionInfo.innerHTML = `<span style="color: #f5222d;">⚠️ 没有找到兼容的维度，请先创建与指标相同数据源的维度</span>`;
            }
            dimensionInfo.style.display = 'block';
        }

        // 添加兼容的维度选项
        compatibleDimensions.forEach(dimension => {
            const option = document.createElement('option');
            option.value = dimension.id;
            option.textContent = dimension.displayName;
            dimensionSelect.appendChild(option);
        });

        // 如果有不兼容的维度，也显示但不推荐
        if (incompatibleDimensions.length > 0) {
            const group = document.createElement('optgroup');
            group.label = '不兼容维度（不推荐使用）';
            incompatibleDimensions.forEach(dimension => {
                const option = document.createElement('option');
                option.value = dimension.id;
                option.textContent = `${dimension.displayName} - 数据源不匹配`;
                option.disabled = true;
                group.appendChild(option);
            });
            dimensionSelect.appendChild(group);
        }
    }

    toggleDataCardConfig() {
        const type = document.getElementById('dataCardType').value;
        
        // 隐藏所有配置区域
        const configElements = ['kpiConfig', 'chartConfig', 'tableConfig', 'mapConfig'];
        configElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = 'none';
            }
        });
        
        // 显示/隐藏指标选择器
        const singleMetricConfig = document.getElementById('singleMetricConfig');
        const tableMetricsConfig = document.getElementById('tableConfig');
        
        if (singleMetricConfig) {
            if (type === 'table') {
                singleMetricConfig.style.display = 'none'; // 表格类型隐藏单指标选择器
            } else {
                singleMetricConfig.style.display = 'block'; // 其他类型显示单指标选择器
            }
        }

        // 显示对应的配置区域
        if (type === 'kpi') {
            document.getElementById('kpiConfig').style.display = 'block';
        } else if (['line', 'bar', 'pie'].includes(type)) {
            document.getElementById('chartConfig').style.display = 'block';
        } else if (type === 'table') {
            document.getElementById('tableConfig').style.display = 'block';
        } else if (type === 'map') {
            document.getElementById('mapConfig').style.display = 'block';
        }
        
        // 显示图表类型说明和维度推荐
        this.showChartTypeDescription(type);
        this.recommendDimensions(type);
        
        console.log('切换卡片类型到:', type, '显示配置区域:', document.getElementById(type === 'table' ? 'tableConfig' : type + 'Config')?.style.display);
    }

    showChartTypeDescription(type) {
        const descriptions = {
            'kpi': '📈 KPI指标卡：适用于展示单个关键指标，如总销售额、用户数量等',
            'line': '📉 折线图：适用于展示时间趋势，如销售额趋势、用户增长趋势等',
            'bar': '📊 柱状图：适用于分类比较，如不同产品销量、不同地区用户数等',
            'pie': '🥧 饼图：适用于展示占比关系，如产品类别占比、用户来源占比等',
            'table': '📋 数据表格：适用于详细数据展示，如订单明细、用户列表等',
            'map': '🗺️ 地图：适用于地理分布分析，如用户地域分布、销售区域分布等'
        };
        
        // 创建或更新说明区域
        let descriptionElement = document.getElementById('chartTypeDescription');
        if (!descriptionElement) {
            descriptionElement = document.createElement('div');
            descriptionElement.id = 'chartTypeDescription';
            descriptionElement.className = 'chart-type-description';
            document.getElementById('dataCardType').parentNode.appendChild(descriptionElement);
        }
        
        descriptionElement.innerHTML = `<div class="chart-description">${descriptions[type] || ''}</div>`;
    }

    recommendDimensions(type) {
        const dimensionSelect = document.getElementById('dataCardDimension');
        const compatibilityInfo = document.getElementById('dimensionCompatibilityInfo');
        
        if (!dimensionSelect || !compatibilityInfo) return;
        
        // 清空之前的推荐信息
        compatibilityInfo.innerHTML = '';
        compatibilityInfo.style.display = 'none';
        
        // 根据图表类型推荐维度类型
        const recommendedTypes = this.getRecommendedDimensionTypes(type);
        if (recommendedTypes.length === 0) return;
        
        // 检查当前可用的维度
        const availableDimensions = this.dimensions.filter(dim => 
            recommendedTypes.includes(dim.type)
        );
        
        if (availableDimensions.length > 0) {
            const typeNames = {
                'time': '时间维度',
                'business': '业务维度', 
                'geography': '地理维度',
                'other': '其他维度'
            };
            
            const recommendedText = recommendedTypes.map(t => typeNames[t]).join('、');
            compatibilityInfo.innerHTML = `
                <div class="compatibility-tip">
                    <span class="tip-icon">💡</span>
                    <strong>推荐维度类型：</strong>${recommendedText}
                    <br><small>适合用于${this.getChartPurpose(type)}分析</small>
                </div>
            `;
            compatibilityInfo.style.display = 'block';
        }
    }

    getRecommendedDimensionTypes(chartType) {
        const recommendations = {
            'line': ['time'], // 折线图推荐时间维度
            'bar': ['business', 'time'], // 柱状图推荐业务和时间维度
            'pie': ['business'], // 饼图推荐业务维度
            'map': ['geography'], // 地图推荐地理维度
            'kpi': [], // KPI通常不需要维度
            'table': ['business', 'time'] // 表格推荐业务和时间维度
        };
        return recommendations[chartType] || [];
    }

    getChartPurpose(chartType) {
        const purposes = {
            'line': '时间趋势',
            'bar': '分类对比',
            'pie': '占比关系',
            'map': '地理分布',
            'kpi': '关键指标',
            'table': '详细数据'
        };
        return purposes[chartType] || '数据分析';
    }

    selectTemplate(templateType) {
        document.getElementById('dataCardModalTitle').textContent = `创建${this.getTemplateName(templateType)}`;
        this.resetForm();
        
        // 设置默认类型
        document.getElementById('dataCardType').value = templateType;
        
        // 预填充模板配置
        if (templateType === 'kpi') {
            document.getElementById('kpiFormat').value = 'currency';
            document.getElementById('kpiComparison').value = 'previous_period';
        } else if (templateType === 'line') {
            document.getElementById('chartTitle').value = '趋势分析';
            document.getElementById('xAxisLabel').value = '时间';
            document.getElementById('yAxisLabel').value = '数值';
        } else if (templateType === 'bar') {
            document.getElementById('chartTitle').value = '对比分析';
            document.getElementById('xAxisLabel').value = '类别';
            document.getElementById('yAxisLabel').value = '数值';
        } else if (templateType === 'pie') {
            document.getElementById('chartTitle').value = '占比分析';
        } else if (templateType === 'table') {
            document.getElementById('tableColumns').value = 6;
            document.getElementById('tablePageSize').value = 10;
        } else if (templateType === 'map') {
            document.getElementById('mapType').value = 'china';
        }
        
        this.toggleDataCardConfig();
        document.getElementById('dataCardModal').classList.add('show');
    }

    getTemplateName(type) {
        const nameMap = {
            'kpi': 'KPI指标卡',
            'line': '折线图',
            'bar': '柱状图',
            'pie': '饼图',
            'table': '数据表格',
            'map': '地图'
        };
        return nameMap[type] || type;
    }

    loadDataCards() {
        const myDataCards = document.getElementById('myDataCards');
        
        if (this.dataCards.length === 0) {
            myDataCards.innerHTML = '<div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 40px;">暂无数据卡片，从模板开始创建或点击"创建数据卡片"</div>';
            return;
        }

        myDataCards.innerHTML = this.dataCards.map((card, index) => {
            // 根据卡片类型获取指标信息
            let metrics = [];
            if (card.type === 'table' && card.metricIds && card.metricIds.length > 0) {
                // 表格类型：多指标
                metrics = card.metricIds.map(id => 
                    this.metrics.find(m => m.id === id) || { displayName: '未知指标' }
                );
            } else if (card.metricId) {
                // 其他类型：单指标
                const metric = this.metrics.find(m => m.id === card.metricId) || { displayName: '未知指标' };
                metrics = [metric];
            }
            
            const dimension = card.dimensionId ? this.dimensions.find(d => d.id === card.dimensionId) : null;
            
            const iconMap = {
                'kpi': '📈',
                'line': '📉',
                'bar': '📊',
                'pie': '🥧',
                'table': '📋',
                'map': '🗺️'
            };

            return `
                <div class="card">
                    <div class="card-title">
                        <span>${iconMap[card.type]}</span>
                        ${card.name}
                    </div>
                    <div class="card-content">
                        <p><strong>类型：</strong>${this.getTemplateName(card.type)}</p>
                        <p><strong>指标：</strong>${metrics.length > 0 ? 
                            (card.type === 'table' ? 
                                metrics.map(m => m.displayName).join('、') : 
                                metrics[0].displayName) : 
                            '无指标'}</p>
                        ${dimension ? `<p><strong>维度：</strong>${dimension.displayName}</p>` : 
                            card.type === 'table' ? '<p><strong>维度：</strong>无（明细数据展示）</p>' : ''}
                        <p><strong>创建时间：</strong>${new Date(card.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div class="card-actions">
                        <button class="btn btn-primary" onclick="dataCardsManager.previewDataCard(${index})">预览</button>
                        <button class="btn btn-secondary" onclick="dataCardsManager.editDataCard(${index})">编辑</button>
                        <button class="btn btn-danger" onclick="dataCardsManager.deleteDataCard(${index})">删除</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    showCreateDataCardModal() {
        document.getElementById('dataCardModalTitle').textContent = '创建数据卡片';
        this.resetForm();
        document.getElementById('dataCardModal').classList.add('show');
        
        // 重新绑定关闭按钮事件监听器，确保按钮可用
        this.setupModalCloseListeners();
    }

    editDataCard(index) {
        const card = this.dataCards[index];
        document.getElementById('dataCardModalTitle').textContent = '编辑数据卡片';
        
        // 先重置表单
        this.resetForm();
        
        // 设置卡片类型，这会触发配置区域切换
        document.getElementById('dataCardType').value = card.type;
        
        // 立即切换配置区域，确保正确的表单区域显示
        this.toggleDataCardConfig();
        
        // 填充表单数据
        document.getElementById('dataCardName').value = card.name;
        document.getElementById('dataCardDescription').value = card.description || '';
        
        // 填充指标和维度
        if (card.type === 'table') {
            // 表格类型：多指标
            const tableMetricsSelect = document.getElementById('tableMetrics');
            if (tableMetricsSelect && card.metricIds) {
                // 清除之前的选择
                Array.from(tableMetricsSelect.options).forEach(option => {
                    option.selected = false;
                });
                // 设置新的选择
                card.metricIds.forEach(metricId => {
                    const option = Array.from(tableMetricsSelect.options).find(
                        opt => parseInt(opt.value) === metricId
                    );
                    if (option) option.selected = true;
                });
            }
            document.getElementById('dataCardDimension').value = card.dimensionId || '';
        } else {
            // 其他类型：单指标
            document.getElementById('dataCardMetric').value = card.metricId;
            document.getElementById('dataCardDimension').value = card.dimensionId || '';
        }
        
        // 填充配置
        if (card.type === 'kpi') {
            document.getElementById('kpiFormat').value = card.config?.format || 'number';
            document.getElementById('kpiComparison').value = card.config?.comparison || 'none';
        } else if (['line', 'bar', 'pie'].includes(card.type)) {
            document.getElementById('chartTitle').value = card.config?.title || '';
            document.getElementById('xAxisLabel').value = card.config?.xAxisLabel || '';
            document.getElementById('yAxisLabel').value = card.config?.yAxisLabel || '';
            document.getElementById('chartColorScheme').value = card.config?.colorScheme || 'default';
        } else if (card.type === 'table') {
            document.getElementById('tableColumns').value = card.config?.columns || 5;
            document.getElementById('tablePageSize').value = card.config?.pageSize || 10;
            document.getElementById('tableDimensionUsage').value = card.config?.dimensionUsage || 'grouping';
        } else if (card.type === 'map') {
            document.getElementById('mapType').value = card.config?.mapType || 'china';
            document.getElementById('mapDimension').value = card.config?.mapDimension || '';
        }

        // 保存当前编辑的索引
        this.currentEditIndex = index;
        
        document.getElementById('dataCardModal').classList.add('show');
        
        // 重新绑定关闭按钮事件监听器
        this.setupModalCloseListeners();
    }

    resetForm() {
        document.getElementById('dataCardName').value = '';
        document.getElementById('dataCardType').value = 'kpi';
        document.getElementById('dataCardMetric').value = '';
        document.getElementById('dataCardDimension').value = '';
        document.getElementById('kpiFormat').value = 'number';
        document.getElementById('kpiComparison').value = 'none';
        document.getElementById('chartTitle').value = '';
        document.getElementById('xAxisLabel').value = '';
        document.getElementById('yAxisLabel').value = '';
        document.getElementById('chartColorScheme').value = 'default';
        document.getElementById('tableColumns').value = 5;
        document.getElementById('tablePageSize').value = 10;
        document.getElementById('mapType').value = 'china';
        document.getElementById('mapDimension').value = '';
        document.getElementById('dataCardDescription').value = '';
        
        this.currentEditIndex = null;
        this.toggleDataCardConfig();
    }

    saveDataCard() {
        const name = document.getElementById('dataCardName').value.trim();
        const type = document.getElementById('dataCardType').value;
        const description = document.getElementById('dataCardDescription').value.trim();
        
        // 根据卡片类型获取指标和维度配置
        let metricId = null;
        let metricIds = [];
        let dimensionId = null;
        
        if (type === 'table') {
            // 表格类型：支持多指标
            const tableMetricsSelect = document.getElementById('tableMetrics');
            if (tableMetricsSelect) {
                const selectedOptions = Array.from(tableMetricsSelect.selectedOptions)
                    .filter(option => option.value)
                    .map(option => parseInt(option.value));
                metricIds = selectedOptions;
            }
            
            if (metricIds.length === 0) {
                alert('请至少选择一个指标');
                return;
            }
            
            // 表格可以没有维度
            dimensionId = document.getElementById('dataCardDimension').value ? 
                parseInt(document.getElementById('dataCardDimension').value) : null;
        } else {
            // 其他类型：单指标
            metricId = parseInt(document.getElementById('dataCardMetric').value);
            dimensionId = document.getElementById('dataCardDimension').value ? 
                parseInt(document.getElementById('dataCardDimension').value) : null;
            
            if (!name || !metricId) {
                alert('请填写必填字段（卡片名称、指标）');
                return;
            }
        }

        // 数据一致性检查
        if (dimensionId) {
            const metric = this.metrics.find(m => m.id === metricId);
            const dimension = this.dimensions.find(d => d.id === dimensionId);
            
            if (metric && dimension) {
                if (!this.validateDimensionMetricCompatibility(dimension, metric)) {
                    const confirmResult = confirm(
                        `警告：选择的维度 "${dimension.displayName}" 与指标 "${metric.displayName}" 数据源不匹配。\n\n` +
                        `指标数据源: ${this.getDataSourceName(metric.dataSourceId)}\n` +
                        `维度数据源: ${this.getDataSourceName(dimension.dataSourceId)}\n\n` +
                        `是否继续创建？可能会产生数据不一致问题。`
                    );
                    if (!confirmResult) return;
                }
            }
        }

        const config = {};
        
        // 根据类型收集配置
        if (type === 'kpi') {
            config.format = document.getElementById('kpiFormat').value;
            config.comparison = document.getElementById('kpiComparison').value;
        } else if (['line', 'bar', 'pie'].includes(type)) {
            config.title = document.getElementById('chartTitle').value;
            config.xAxisLabel = document.getElementById('xAxisLabel').value;
            config.yAxisLabel = document.getElementById('yAxisLabel').value;
            config.colorScheme = document.getElementById('chartColorScheme').value;
        } else if (type === 'table') {
            config.metricIds = metricIds; // 多指标配置
            config.columns = parseInt(document.getElementById('tableColumns').value);
            config.pageSize = parseInt(document.getElementById('tablePageSize').value);
            config.dimensionUsage = document.getElementById('tableDimensionUsage').value;
        } else if (type === 'map') {
            config.mapType = document.getElementById('mapType').value;
            config.mapDimension = document.getElementById('mapDimension').value ? 
                parseInt(document.getElementById('mapDimension').value) : null;
        }

        const dataCard = {
            id: this.currentEditIndex !== null ? this.dataCards[this.currentEditIndex].id : Date.now(),
            name,
            type,
            metricId: type === 'table' ? null : metricId, // 表格类型不使用单指标ID
            metricIds: type === 'table' ? metricIds : [], // 表格类型使用多指标ID
            dimensionId,
            config,
            description,
            createdAt: this.currentEditIndex !== null ? this.dataCards[this.currentEditIndex].createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (this.currentEditIndex !== null) {
            // 更新现有数据卡片
            this.dataCards[this.currentEditIndex] = dataCard;
        } else {
            // 添加新数据卡片
            this.dataCards.push(dataCard);
        }

        this.saveToStorage();
        this.loadDataCards();
        this.closeDataCardModal();
        
        alert(this.currentEditIndex !== null ? '数据卡片更新成功' : '数据卡片创建成功');
    }

    deleteDataCard(index) {
        if (confirm('确定要删除这个数据卡片吗？')) {
            this.dataCards.splice(index, 1);
            this.saveToStorage();
            this.loadDataCards();
            alert('数据卡片删除成功');
        }
    }

    previewDataCard(index) {
        const card = this.dataCards[index];
        
        // 获取指标信息
        let metrics = [];
        if (card.type === 'table' && card.metricIds) {
            // 表格类型：多指标
            metrics = card.metricIds.map(id => 
                this.metrics.find(m => m.id === id) || { displayName: '未知指标' }
            );
        } else {
            // 其他类型：单指标
            const metric = this.metrics.find(m => m.id === card.metricId) || { displayName: '未知指标' };
            metrics = [metric];
        }
        
        const dimension = card.dimensionId ? this.dimensions.find(d => d.id === card.dimensionId) : null;
        
        // 检查数据一致性
        const validationResult = this.validateDataCardConfiguration(card);
        
        document.getElementById('dataCardPreviewTitle').textContent = `数据卡片预览 - ${card.name}`;
        
        let previewContent = `
            <div class="preview-header">
                <h3>${card.name}</h3>
                <p>${card.description || '无描述'}</p>
            </div>
            <div class="preview-info">
                <p><strong>类型：</strong>${this.getTemplateName(card.type)}</p>
                <p><strong>指标：</strong>${card.type === 'table' ? 
                    metrics.map(m => m.displayName).join('、') : 
                    metrics[0].displayName}</p>
                ${dimension ? `<p><strong>维度：</strong>${dimension.displayName}</p>` : 
                    card.type === 'table' ? '<p><strong>维度：</strong>无（明细数据展示）</p>' : ''}
                <p><strong>数据一致性：</strong>
                    ${validationResult.isValid ? 
                        validationResult.hasWarnings ? 
                            '<span style="color: #faad14;">⚠️ 配置存在警告</span>' : 
                            '<span style="color: #52c41a;">✅ 配置正确</span>' : 
                        '<span style="color: #f5222d;">❌ 存在配置问题</span>'}
                </p>
            </div>
            ${!validationResult.isValid ? `
            <div class="preview-warnings" style="background: #fff2f0; border: 1px solid #ffccc7; padding: 10px; border-radius: 4px; margin: 10px 0;">
                <h4 style="color: #f5222d; margin: 0 0 8px 0;">❌ 配置问题</h4>
                <ul style="margin: 0; padding-left: 20px;">
                    ${validationResult.issues.map(issue => `<li>${issue}</li>`).join('')}
                </ul>
            </div>
            ` : ''}
            ${validationResult.hasWarnings ? `
            <div class="preview-warnings" style="background: #fffbe6; border: 1px solid #ffe58f; padding: 10px; border-radius: 4px; margin: 10px 0;">
                <h4 style="color: #faad14; margin: 0 0 8px 0;">⚠️ 配置警告</h4>
                <ul style="margin: 0; padding-left: 20px;">
                    ${validationResult.warnings.map(warning => `<li>${warning}</li>`).join('')}
                </ul>
            </div>
            ` : ''}
            <div class="preview-content">
                <h4>预览效果</h4>
                <div class="preview-placeholder" style="background: #f5f5f5; padding: 40px; text-align: center; border-radius: 8px;">
        `;

        // 根据卡片类型生成预览
        if (card.type === 'kpi') {
            previewContent += `
                <div style="font-size: 48px; color: #1890ff; margin-bottom: 10px;">1,234</div>
                <div style="color: #52c41a;">↑ 8.2% 较上月</div>
                <p style="font-size: 14px; color: #666;">安全事件总数</p>
            `;
        } else if (card.type === 'line') {
            previewContent += `
                <div style="height: 200px; background: linear-gradient(to top, #1890ff 0%, #1890ff 100%); border-left: 1px solid #ccc; border-bottom: 1px solid #ccc; position: relative;">
                    <div style="position: absolute; bottom: 0; left: 0; right: 0; display: flex; justify-content: space-around;">
                        <span>08:00</span><span>10:00</span><span>12:00</span><span>14:00</span><span>16:00</span>
                    </div>
                </div>
                <p style="margin-top: 10px;">网络安全事件趋势分析 - 显示时间序列变化</p>
            `;
        } else if (card.type === 'bar') {
            previewContent += `
                <div style="height: 200px; display: flex; align-items: end; gap: 10px; border-left: 1px solid #ccc; border-bottom: 1px solid #ccc; padding: 0 20px;">
                    <div style="flex: 1; background: #1890ff; height: 80%;"></div>
                    <div style="flex: 1; background: #52c41a; height: 60%;"></div>
                    <div style="flex: 1; background: #faad14; height: 90%;"></div>
                    <div style="flex: 1; background: #f5222d; height: 40%;"></div>
                </div>
                <div style="display: flex; justify-content: space-around; margin-top: 10px;">
                    <span>车辆A</span><span>车辆B</span><span>车辆C</span><span>车辆D</span>
                </div>
                <p style="margin-top: 10px;">车辆安全状态对比分析 - 比较不同车辆</p>
            `;
        } else if (card.type === 'pie') {
            previewContent += `
                <div style="width: 150px; height: 150px; border-radius: 50%; background: conic-gradient(#1890ff 0% 40%, #52c41a 40% 70%, #faad14 70% 100%); margin: 0 auto;"></div>
                <p style="margin-top: 10px;">安全事件类型占比分析 - 显示不同事件类型分布</p>
            `;
        } else if (card.type === 'table') {
            // 表格类型：支持多指标
            const columnHeaders = dimension ? 
                ['时间', '车辆ID'].concat(metrics.map(m => m.displayName)) :
                metrics.map(m => m.displayName);
            
            previewContent += `
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                    <thead>
                        <tr style="background: #fafafa;">
                            ${columnHeaders.map(header => 
                                `<th style="padding: 8px; border: 1px solid #e8e8e8;">${header}</th>`
                            ).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>${columnHeaders.map(() => 
                            `<td style="padding: 8px; border: 1px solid #e8e8e8; text-align: center;">示例数据</td>`
                        ).join('')}</tr>
                        <tr>${columnHeaders.map(() => 
                            `<td style="padding: 8px; border: 1px solid #e8e8e8; text-align: center;">示例数据</td>`
                        ).join('')}</tr>
                        <tr>${columnHeaders.map(() => 
                            `<td style="padding: 8px; border: 1px solid #e8e8e8; text-align: center;">示例数据</td>`
                        ).join('')}</tr>
                    </tbody>
                </table>
                <div style="margin-top: 10px; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 12px; color: #666;">
                        ${dimension ? '按维度分组展示' : '明细数据展示'} | 共 ${metrics.length} 个指标
                    </span>
                    <span style="font-size: 12px; color: #666;">第 1 页 / 共 3 页</span>
                </div>
            `;
        } else if (card.type === 'map') {
            previewContent += `
                <div style="height: 200px; background: #e6f7ff; display: flex; align-items: center; justify-content: center;">
                    <div style="text-align: center;">
                        <div style="font-size: 48px;">🚗</div>
                        <p>车辆分布地图预览 - ${card.config?.mapType === 'china' ? '中国区域分布' : '全球车辆分布'}</p>
                    </div>
                </div>
            `;
        }

        previewContent += '</div></div>';
        
        document.getElementById('dataCardPreviewContent').innerHTML = previewContent;
        document.getElementById('dataCardPreviewModal').classList.add('show');
    }

    closeDataCardModal() {
        document.getElementById('dataCardModal').classList.remove('show');
    }

    closeDataCardPreviewModal() {
        document.getElementById('dataCardPreviewModal').classList.remove('show');
    }

    // 数据一致性检查函数
    validateDimensionMetricCompatibility(dimension, metric) {
        // 基础检查：数据源是否一致
        if (dimension.dataSourceId !== metric.dataSourceId) {
            return false;
        }
        
        // 增强检查：跨表关联验证
        return this.validateCrossTableCompatibility(dimension, metric);
    }
    
    // 跨表关联验证
    validateCrossTableCompatibility(dimension, metric) {
        // 获取维度表和指标表
        const dimensionTable = this.getDimensionTable(dimension);
        const metricTable = this.getMetricTable(metric);
        
        // 如果维度或指标没有指定表，返回true（保持向后兼容）
        if (!dimensionTable || !metricTable) return true;
        
        // 相同表：完全兼容
        if (dimensionTable === metricTable) return true;
        
        // 不同表：检查预定义的关联关系
        return this.checkTableRelationship(dimensionTable, metricTable);
    }
    
    // 获取维度表名
    getDimensionTable(dimension) {
        // 使用统一的数据配置文件中的字段到表映射
        const fieldToTableMap = window.DataConfig?.fieldToTableMap || {};
        return fieldToTableMap[dimension.field] || null;
    }
    
    // 获取指标表名
    getMetricTable(metric) {
        // 使用统一的数据配置文件中的字段到表映射
        const fieldToTableMap = window.DataConfig?.fieldToTableMap || {};
        
        // 从公式中提取字段名
        const fieldMatch = metric.formula.match(/\w+\((\w+)\)/);
        if (fieldMatch && fieldMatch[1]) {
            return fieldToTableMap[fieldMatch[1]] || null;
        }
        
        return null;
    }
    
    // 检查表间关联关系
    checkTableRelationship(table1, table2) {
        // 使用统一的数据配置文件中的表关系映射
        const tableRelationships = window.DataConfig?.tableRelationships || {};
        
        return tableRelationships[table1]?.includes(table2) || 
               tableRelationships[table2]?.includes(table1) ||
               false;
    }

    // 获取数据源名称
    getDataSourceName(dataSourceId) {
        const dataSource = this.dataSources.find(ds => ds.id === dataSourceId);
        return dataSource ? dataSource.name : '未知数据源';
    }

    // 智能推荐维度
    recommendDimensions(metricId) {
        const metric = this.metrics.find(m => m.id === metricId);
        if (!metric) return [];
        
        const compatibleDimensions = this.dimensions.filter(d => d.dataSourceId === metric.dataSourceId);
        
        // 根据维度类型进行智能排序：时间维度 > 地理维度 > 业务维度
        return compatibleDimensions.sort((a, b) => {
            const typePriority = { 'time': 3, 'geography': 2, 'business': 1 };
            return (typePriority[b.type] || 0) - (typePriority[a.type] || 0);
        });
    }

    // 检查数据卡片配置的完整性
    validateDataCardConfiguration(card) {
        // 根据卡片类型获取指标信息
        let metrics = [];
        if (card.type === 'table' && card.metricIds && card.metricIds.length > 0) {
            // 表格类型：多指标
            metrics = card.metricIds.map(id => this.metrics.find(m => m.id === id)).filter(Boolean);
        } else if (card.metricId) {
            // 其他类型：单指标
            const metric = this.metrics.find(m => m.id === card.metricId);
            if (metric) metrics = [metric];
        }
        
        const dimension = card.dimensionId ? this.dimensions.find(d => d.id === card.dimensionId) : null;
        
        const issues = [];
        const warnings = [];
        
        // 检查指标存在性
        if (card.type === 'table') {
            if (metrics.length === 0) {
                issues.push('未选择任何指标');
            } else if (card.metricIds && card.metricIds.length !== metrics.length) {
                issues.push('部分指标不存在');
            }
        } else {
            if (metrics.length === 0) {
                issues.push('关联的指标不存在');
            }
        }
        
        if (dimension && metrics.length > 0) {
            // 对于表格类型，检查维度与所有指标的数据源兼容性
            if (card.type === 'table') {
                const incompatibleMetrics = metrics.filter(metric => 
                    !this.validateDimensionMetricCompatibility(dimension, metric)
                );
                
                if (incompatibleMetrics.length > 0) {
                    issues.push(`维度与 ${incompatibleMetrics.length} 个指标数据源不匹配`);
                }
            } else {
                // 其他类型：单指标检查
                if (!this.validateDimensionMetricCompatibility(dimension, metrics[0])) {
                    issues.push('维度与指标数据源不匹配');
                } else {
                    // 检查跨表关联问题
                    const crossTableCheck = this.checkCrossTableCompatibility(dimension, metrics[0]);
                    if (!crossTableCheck.isCompatible) {
                        warnings.push(crossTableCheck.message);
                    }
                }
            }
            
            // 检查图表类型与维度类型的兼容性
            if (card.type === 'map' && dimension.type !== 'geography') {
                issues.push('地图类型的数据卡片需要使用地理维度');
            }
            
            if (['line', 'bar'].includes(card.type) && dimension.type !== 'time') {
                issues.push('趋势图建议使用时间维度');
            }
        }
        
        return {
            isValid: issues.length === 0,
            issues: issues,
            warnings: warnings,
            hasWarnings: warnings.length > 0
        };
    }
    
    // 检查跨表兼容性
    checkCrossTableCompatibility(dimension, metric) {
        const dimensionTable = this.getDimensionTable(dimension);
        const metricTable = this.getMetricTable(metric);
        
        if (!dimensionTable || !metricTable) {
            return {
                isCompatible: true,
                message: ''
            };
        }
        
        if (dimensionTable === metricTable) {
            return {
                isCompatible: true,
                message: ''
            };
        }
        
        const isRelated = this.checkTableRelationship(dimensionTable, metricTable);
        
        if (!isRelated) {
            return {
                isCompatible: false,
                message: `维度与指标来自不同的数据表（${dimensionTable} vs ${metricTable}），可能存在关联问题`
            };
        }
        
        return {
            isCompatible: true,
            message: `维度与指标来自关联数据表（${dimensionTable} ↔ ${metricTable}）`
        };
    }


}

// 初始化数据卡片管理器
let dataCardsManager;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    dataCardsManager = new DataCardsManager();
    
    // 确保演示数据正确加载
    console.log('数据卡片管理器初始化完成');
    console.log('数据卡片数量：', dataCardsManager.dataCards.length);
    console.log('指标数量：', dataCardsManager.metrics.length);
    console.log('维度数量：', dataCardsManager.dimensions.length);
    
    // 立即创建示例数据卡片，无需延迟
    if (dataCardsManager.dataCards.length === 0) {
        createSampleDataCards();
    }
});

// 创建示例数据卡片
function createSampleDataCards() {
    if (!dataCardsManager) return;
    
    // 获取当前可用的指标和维度
    const sampleMetrics = dataCardsManager.metrics;
    const sampleDimensions = dataCardsManager.dimensions;
    
    if (sampleMetrics.length === 0 || sampleDimensions.length === 0) {
        console.log('指标或维度数据不足，跳过示例数据卡片创建');
        return;
    }
    
    const sampleDataCards = [
        {
            id: Date.now(),
            name: '车辆安全监控KPI',
            type: 'kpi',
            metricId: sampleMetrics[0]?.id || 1,
            dimensionId: null,
            config: {
                format: 'number',
                comparison: 'previous_period'
            },
            description: '显示车辆安全监控的KPI指标卡',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: Date.now() + 1,
            name: '网络安全事件趋势分析',
            type: 'line',
            metricId: sampleMetrics.length > 1 ? sampleMetrics[1]?.id : sampleMetrics[0]?.id,
            dimensionId: sampleDimensions.find(d => d.type === 'time')?.id || sampleDimensions[0]?.id,
            config: {
                title: '网络安全事件趋势分析',
                xAxisLabel: '时间',
                yAxisLabel: '事件数量',
                colorScheme: 'blue'
            },
            description: '显示网络安全事件趋势的折线图',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: Date.now() + 2,
            name: '车辆安全事件明细表',
            type: 'table',
            metricId: null,
            metricIds: sampleMetrics.slice(0, 3).map(m => m.id),
            dimensionId: sampleDimensions.find(d => d.type === 'time')?.id || sampleDimensions[0]?.id,
            config: {
                metricIds: sampleMetrics.slice(0, 3).map(m => m.id),
                columns: 6,
                pageSize: 10,
                dimensionUsage: 'grouping'
            },
            description: '按时间维度分组显示车辆安全事件的详细统计信息',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ];
    
    dataCardsManager.dataCards = sampleDataCards;

    dataCardsManager.loadDataCards();
    
    console.log('示例数据卡片创建完成，数量：', sampleDataCards.length);
}

// 全局函数供HTML调用
function showCreateDataCardModal() {
    if (window.dataCardsManager && dataCardsManager.isInitialized) {
        dataCardsManager.showCreateDataCardModal();
    } else {
        console.warn('数据卡片管理器正在初始化中');
        // 直接显示数据卡片模态框，不显示等待提示框
        const modal = document.getElementById('dataCardModal');
        if (modal) {
            modal.classList.add('show');
            // 直接显示创建数据卡片的模态框
            if (window.dataCardsManager) {
                dataCardsManager.showCreateDataCardModal();
            }
        } else {
            alert('系统正在初始化，请稍后重试');
        }
    }
}

function closeDataCardModal() {
    if (window.dataCardsManager) {
        dataCardsManager.closeDataCardModal();
    }
}

function closeDataCardPreviewModal() {
    if (window.dataCardsManager) {
        dataCardsManager.closeDataCardPreviewModal();
    }
}

function toggleDataCardConfig() {
    if (window.dataCardsManager) {
        dataCardsManager.toggleDataCardConfig();
    }
}

function loadMetricDimensions() {
    if (window.dataCardsManager) {
        dataCardsManager.loadMetricDimensions();
    }
}

function selectTemplate(templateType) {
    if (window.dataCardsManager) {
        dataCardsManager.selectTemplate(templateType);
    }
}

function saveDataCard() {
    if (window.dataCardsManager) {
        dataCardsManager.saveDataCard();
    }
}