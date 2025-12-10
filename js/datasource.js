// 数据源管理逻辑 - 优化版本
class DataSourceManager {
    constructor() {
        // 延迟初始化，避免阻塞页面渲染
        this.dataSources = [];
        this.isInitialized = false;
        
        // 异步初始化，提高页面响应速度
        this.initAsync();
    }
    
    // 异步初始化
    async initAsync() {
        // 等待dataConfig加载完成
        await this.waitForDataConfig();
        
        // 按需加载数据
        this.dataSources = this.loadDataSourcesFromConfig();
        
        this.isInitialized = true;
        this.init();
        
        console.log('数据源管理器异步初始化完成');
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
    
    // 从dataConfig中加载数据源
    loadDataSourcesFromConfig() {
        const baseDataSources = window.DataConfig?.dataSources || [];
        return baseDataSources.map(ds => ({
            ...ds,
            status: 'disconnected', // 默认未连接状态
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            config: this.getDefaultConfig(ds.type)
        }));
    }
    
    // 根据数据源类型获取默认配置
    getDefaultConfig(type) {
        const configMap = {
            'mysql': {
                host: 'localhost',
                port: '3306',
                database: `${type}_db`,
                username: 'admin'
            },
            'postgresql': {
                host: 'localhost',
                port: '5432',
                database: `${type}_db`,
                username: 'admin'
            },
            'iot': {
                endpoint: 'https://api.iot.com/data',
                authType: 'bearer',
                token: 'iot_token'
            },
            'security': {
                endpoint: 'https://api.security.com/data',
                authType: 'bearer',
                token: 'security_token'
            },
            'monitoring': {
                endpoint: 'https://api.monitoring.com/data',
                authType: 'bearer',
                token: 'monitoring_token'
            },
            'api': {
                endpoint: 'https://api.example.com/data',
                authType: 'bearer',
                token: 'api_token'
            }
        };
        
        return configMap[type] || {};
    }

    init() {
        this.loadDataSources();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // 数据源类型切换
        document.getElementById('dataSourceType').addEventListener('change', () => {
            this.toggleDataSourceFields();
        });

        // API认证方式切换
        document.getElementById('apiAuthType').addEventListener('change', () => {
            this.toggleApiAuthFields();
        });

        // 搜索功能
        document.getElementById('searchDataSource').addEventListener('input', () => {
            this.filterDataSources();
        });

        // 模态框关闭事件监听器
        this.setupModalCloseListeners();
    }

    // 设置模态框关闭事件监听器
    setupModalCloseListeners() {
        // 创建数据源模态框关闭按钮
        const closeDataSourceModalBtn = document.getElementById('closeDataSourceModalBtn');
        if (closeDataSourceModalBtn) {
            closeDataSourceModalBtn.addEventListener('click', () => this.closeDataSourceModal());
        }
        
        // 取消按钮
        const cancelDataSourceBtn = document.getElementById('cancelDataSourceBtn');
        if (cancelDataSourceBtn) {
            cancelDataSourceBtn.addEventListener('click', () => this.closeDataSourceModal());
        }
        
        // 详情模态框关闭按钮
        const closeDataSourceDetailModalBtn = document.getElementById('closeDataSourceDetailModalBtn');
        if (closeDataSourceDetailModalBtn) {
            closeDataSourceDetailModalBtn.addEventListener('click', () => this.closeDataSourceDetailModal());
        }
        
        // 模态框背景点击关闭
        const dataSourceModal = document.getElementById('dataSourceModal');
        const dataSourceDetailModal = document.getElementById('dataSourceDetailModal');
        
        if (dataSourceModal) {
            dataSourceModal.addEventListener('click', (e) => {
                if (e.target === dataSourceModal) {
                    this.closeDataSourceModal();
                }
            });
        }
        
        if (dataSourceDetailModal) {
            dataSourceDetailModal.addEventListener('click', (e) => {
                if (e.target === dataSourceDetailModal) {
                    this.closeDataSourceDetailModal();
                }
            });
        }
    }

    toggleDataSourceFields() {
        const type = document.getElementById('dataSourceType').value;
        
        // 隐藏所有配置区域
        document.getElementById('databaseConfig').style.display = 'none';
        document.getElementById('apiConfig').style.display = 'none';
        document.getElementById('fileConfig').style.display = 'none';

        // 显示对应的配置区域
        if (['mysql', 'postgresql'].includes(type)) {
            document.getElementById('databaseConfig').style.display = 'block';
        } else if (type === 'api') {
            document.getElementById('apiConfig').style.display = 'block';
            this.toggleApiAuthFields();
        } else if (type === 'file') {
            document.getElementById('fileConfig').style.display = 'block';
        }
    }

    toggleApiAuthFields() {
        const authType = document.getElementById('apiAuthType').value;
        const tokenGroup = document.getElementById('apiTokenGroup');
        
        if (authType === 'bearer') {
            tokenGroup.style.display = 'block';
        } else {
            tokenGroup.style.display = 'none';
        }
    }

    loadDataSources() {
        const tbody = document.getElementById('dataSourceList');
        const cardsContainer = document.getElementById('dataSourceCards');
        
        if (this.dataSources.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px;">暂无数据源，点击"创建数据源"开始添加</td></tr>';
            cardsContainer.style.display = 'none';
            return;
        }

        cardsContainer.style.display = 'block';
        
        // 表格视图
        tbody.innerHTML = this.dataSources.map((ds, index) => `
            <tr>
                <td>${ds.name}</td>
                <td>${this.getDataSourceTypeText(ds.type)}</td>
                <td>
                    <span class="status-badge ${ds.status === 'connected' ? 'connected' : 'disconnected'}">
                        ${ds.status === 'connected' ? '已连接' : '未连接'}
                    </span>
                </td>
                <td>${this.getConnectionInfo(ds)}</td>
                <td>${new Date(ds.createdAt).toLocaleDateString()}</td>
                <td class="action-buttons">
                    <button class="btn-small primary" onclick="dataSourceManager.editDataSource(${index})">编辑</button>
                    <button class="btn-small secondary" onclick="dataSourceManager.showDataSourceDetail(${index})">详情</button>
                    <button class="btn-small danger" onclick="dataSourceManager.deleteDataSource(${index})">删除</button>
                </td>
            </tr>
        `).join('');

        // 卡片视图
        cardsContainer.innerHTML = this.dataSources.map((ds, index) => `
            <div class="card">
                <div class="card-title">
                    <span>🗄️</span>
                    ${ds.name}
                </div>
                <div class="card-content">
                    <p><strong>类型：</strong>${this.getDataSourceTypeText(ds.type)}</p>
                    <p><strong>状态：</strong>
                        <span class="status-badge ${ds.status === 'connected' ? 'connected' : 'disconnected'}">
                            ${ds.status === 'connected' ? '已连接' : '未连接'}
                        </span>
                    </p>
                    <p><strong>创建时间：</strong>${new Date(ds.createdAt).toLocaleDateString()}</p>
                </div>
                <div class="card-actions">
                    <button class="btn btn-primary" onclick="dataSourceManager.useDataSource(${index})">使用此数据源</button>
                    <button class="btn btn-secondary" onclick="dataSourceManager.editDataSource(${index})">编辑配置</button>
                </div>
            </div>
        `).join('');
    }

    getDataSourceTypeText(type) {
        const typeMap = {
            'mysql': 'MySQL数据库',
            'postgresql': 'PostgreSQL数据库',
            'iot': 'IoT设备数据源',
            'security': '网络安全数据源',
            'monitoring': '系统监控数据源',
            'api': 'API接口',
            'file': '文件上传',
            'bigquery': 'Google BigQuery',
            'snowflake': 'Snowflake'
        };
        return typeMap[type] || type;
    }

    getConnectionInfo(dataSource) {
        switch (dataSource.type) {
            case 'mysql':
            case 'postgresql':
                return `${dataSource.config.host}:${dataSource.config.port}/${dataSource.config.database}`;
            case 'api':
                return dataSource.config.endpoint;
            case 'file':
                return `${dataSource.config.fileType}文件`;
            default:
                return '-';
        }
    }

    showCreateDataSourceModal() {
        document.getElementById('dataSourceModalTitle').textContent = '创建数据源';
        this.resetForm();
        document.getElementById('dataSourceModal').classList.add('show');
    }

    editDataSource(index) {
        const ds = this.dataSources[index];
        document.getElementById('dataSourceModalTitle').textContent = '编辑数据源';
        
        // 填充表单数据
        document.getElementById('dataSourceName').value = ds.name;
        document.getElementById('dataSourceType').value = ds.type;
        
        // 根据类型填充配置
        if (ds.type === 'mysql' || ds.type === 'postgresql') {
            document.getElementById('dbHost').value = ds.config.host || '';
            document.getElementById('dbPort').value = ds.config.port || '';
            document.getElementById('dbName').value = ds.config.database || '';
            document.getElementById('dbUsername').value = ds.config.username || '';
        } else if (ds.type === 'api') {
            document.getElementById('apiEndpoint').value = ds.config.endpoint || '';
            document.getElementById('apiAuthType').value = ds.config.authType || 'none';
            document.getElementById('apiToken').value = ds.config.token || '';
        } else if (ds.type === 'file') {
            document.getElementById('fileType').value = ds.config.fileType || 'csv';
        }

        // 保存当前编辑的索引
        this.currentEditIndex = index;
        
        this.toggleDataSourceFields();
        document.getElementById('dataSourceModal').classList.add('show');
    }

    resetForm() {
        document.getElementById('dataSourceName').value = '';
        document.getElementById('dataSourceType').value = 'mysql';
        document.getElementById('dbHost').value = '';
        document.getElementById('dbPort').value = '';
        document.getElementById('dbName').value = '';
        document.getElementById('dbUsername').value = '';
        document.getElementById('dbPassword').value = '';
        document.getElementById('apiEndpoint').value = '';
        document.getElementById('apiAuthType').value = 'none';
        document.getElementById('apiToken').value = '';
        document.getElementById('fileType').value = 'csv';
        document.getElementById('fileUpload').value = '';
        
        this.currentEditIndex = null;
        this.toggleDataSourceFields();
    }

    saveDataSource() {
        const name = document.getElementById('dataSourceName').value.trim();
        const type = document.getElementById('dataSourceType').value;
        
        if (!name) {
            alert('请输入数据源名称');
            return;
        }

        const dataSource = {
            id: this.currentEditIndex !== null ? this.dataSources[this.currentEditIndex].id : Date.now(),
            name,
            type,
            status: 'disconnected',
            createdAt: this.currentEditIndex !== null ? this.dataSources[this.currentEditIndex].createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            config: {}
        };

        // 根据类型设置配置
        if (type === 'mysql' || type === 'postgresql') {
            dataSource.config = {
                host: document.getElementById('dbHost').value,
                port: document.getElementById('dbPort').value,
                database: document.getElementById('dbName').value,
                username: document.getElementById('dbUsername').value,
                password: document.getElementById('dbPassword').value
            };
        } else if (type === 'api') {
            dataSource.config = {
                endpoint: document.getElementById('apiEndpoint').value,
                authType: document.getElementById('apiAuthType').value,
                token: document.getElementById('apiToken').value
            };
        } else if (type === 'file') {
            dataSource.config = {
                fileType: document.getElementById('fileType').value
            };
        }

        if (this.currentEditIndex !== null) {
            // 更新现有数据源
            this.dataSources[this.currentEditIndex] = dataSource;
        } else {
            // 添加新数据源
            this.dataSources.push(dataSource);
        }

        this.loadDataSources();
        this.closeDataSourceModal();
        
        alert(this.currentEditIndex !== null ? '数据源更新成功' : '数据源创建成功');
    }

    deleteDataSource(index) {
        if (confirm('确定要删除这个数据源吗？')) {
            this.dataSources.splice(index, 1);
            this.loadDataSources();
            alert('数据源删除成功');
        }
    }

    showDataSourceDetail(index) {
        const ds = this.dataSources[index];
        document.getElementById('dataSourceDetailTitle').textContent = `数据源详情 - ${ds.name}`;
        
        let detailContent = `
            <div class="detail-info">
                <p><strong>名称：</strong>${ds.name}</p>
                <p><strong>类型：</strong>${this.getDataSourceTypeText(ds.type)}</p>
                <p><strong>状态：</strong>
                    <span class="status-badge ${ds.status === 'connected' ? 'connected' : 'disconnected'}">
                        ${ds.status === 'connected' ? '已连接' : '未连接'}
                    </span>
                </p>
                <p><strong>创建时间：</strong>${new Date(ds.createdAt).toLocaleString()}</p>
                <p><strong>更新时间：</strong>${new Date(ds.updatedAt).toLocaleString()}</p>
            </div>
            <div class="detail-config">
                <h4>配置信息</h4>
        `;

        if (ds.type === 'mysql' || ds.type === 'postgresql') {
            detailContent += `
                <p><strong>主机：</strong>${ds.config.host}</p>
                <p><strong>端口：</strong>${ds.config.port}</p>
                <p><strong>数据库：</strong>${ds.config.database}</p>
                <p><strong>用户名：</strong>${ds.config.username}</p>
            `;
        } else if (ds.type === 'api') {
            detailContent += `
                <p><strong>端点：</strong>${ds.config.endpoint}</p>
                <p><strong>认证方式：</strong>${ds.config.authType}</p>
            `;
        } else if (ds.type === 'file') {
            detailContent += `
                <p><strong>文件类型：</strong>${ds.config.fileType}</p>
            `;
        }

        detailContent += '</div>';
        
        document.getElementById('dataSourceDetailContent').innerHTML = detailContent;
        document.getElementById('dataSourceDetailModal').classList.add('show');
    }

    testDataSourceConnection() {
        const statusElement = document.getElementById('connectionStatus');
        statusElement.textContent = '测试中...';
        statusElement.style.color = '#1890ff';
        
        // 模拟连接测试
        setTimeout(() => {
            const success = Math.random() > 0.3; // 70%成功率
            if (success) {
                statusElement.textContent = '连接成功';
                statusElement.style.color = '#52c41a';
            } else {
                statusElement.textContent = '连接失败';
                statusElement.style.color = '#ff4d4f';
            }
        }, 2000);
    }

    useDataSource(index) {
        const ds = this.dataSources[index];
        alert(`已选择数据源: ${ds.name}`);
        // 这里可以跳转到指标定义页面，并传递数据源信息
        window.location.href = `metrics.html?dataSourceId=${ds.id}`;
    }

    filterDataSources() {
        const searchTerm = document.getElementById('searchDataSource').value.toLowerCase();
        const rows = document.querySelectorAll('#dataSourceList tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    }

    closeDataSourceModal() {
        document.getElementById('dataSourceModal').classList.remove('show');
    }

    closeDataSourceDetailModal() {
        document.getElementById('dataSourceDetailModal').classList.remove('show');
    }

}

// 初始化数据源管理器
let dataSourceManager = new DataSourceManager();

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 确保演示数据正确加载
    console.log('数据源管理器初始化完成，数据源数量：', dataSourceManager.dataSources.length);
    
    // 如果数据源为空，尝试从统一配置中加载基础数据
    if (dataSourceManager.dataSources.length === 0 && window.DataConfig?.dataSources) {
        console.log('从统一配置加载基础数据源...');
        const baseDataSources = window.DataConfig.dataSources;
        dataSourceManager.dataSources = baseDataSources.map(ds => ({
            ...ds,
            status: 'disconnected',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            config: dataSourceManager.getDefaultConfig(ds.type)
        }));
        
        dataSourceManager.loadDataSources();
        console.log('基础数据源加载完成，数量：', dataSourceManager.dataSources.length);
    }
    
    // 确保数据源管理器在全局可用
    window.dataSourceManager = dataSourceManager;
});

// 全局函数供HTML调用
function showCreateDataSourceModal() {
    if (window.dataSourceManager) {
        dataSourceManager.showCreateDataSourceModal();
    } else {
        console.error('数据源管理器未初始化');
        alert('系统正在初始化，请稍后重试');
    }
}

function closeDataSourceModal() {
    if (window.dataSourceManager) {
        dataSourceManager.closeDataSourceModal();
    }
}

function closeDataSourceDetailModal() {
    if (window.dataSourceManager) {
        dataSourceManager.closeDataSourceDetailModal();
    }
}

function testDataSourceConnection() {
    if (window.dataSourceManager) {
        dataSourceManager.testDataSourceConnection();
    }
}

function saveDataSource() {
    if (window.dataSourceManager) {
        dataSourceManager.saveDataSource();
    }
}

function filterDataSources() {
    if (window.dataSourceManager) {
        dataSourceManager.filterDataSources();
    }
}

function toggleDataSourceFields() {
    if (window.dataSourceManager) {
        dataSourceManager.toggleDataSourceFields();
    }
}