// 首页功能逻辑
class HomePageManager {
    constructor() {
        this.recentProjects = [];
        this.init();
    }
    
    init() {
        // 直接初始化，避免延迟等待
        this.loadRecentProjects();
        this.updateDashboardStats();
        console.log('首页管理器初始化完成');
    }
    
    // 加载最近项目
    loadRecentProjects() {
        // 使用dataConfig.js中的数据
        const dataConfig = window.DataConfig || {};
        
        // 创建最近项目列表
        this.recentProjects = [
            {
                id: 1,
                name: '车辆安全监控仪表盘',
                type: 'dashboard',
                dataSource: '车辆安全监控数据源',
                lastModified: new Date().toISOString(),
                description: '车辆安全监控的实时仪表盘',
                icon: '🚗'
            },
            {
                id: 2,
                name: '网络安全事件分析',
                type: 'report',
                dataSource: '网络安全事件数据源',
                lastModified: new Date(Date.now() - 86400000).toISOString(), // 1天前
                description: '网络安全事件的趋势分析报告',
                icon: '🔒'
            },
            {
                id: 3,
                name: '系统性能监控',
                type: 'dashboard',
                dataSource: '系统运行状态数据源',
                lastModified: new Date(Date.now() - 172800000).toISOString(), // 2天前
                description: '系统运行状态的实时监控',
                icon: '💻'
            }
        ];
        
        this.renderRecentProjects();
    }
    
    // 渲染最近项目列表
    renderRecentProjects() {
        const container = document.getElementById('recentProjectsList');
        if (!container) return;
        
        if (this.recentProjects.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #999;">暂无最近项目</p>';
            return;
        }
        
        container.innerHTML = this.recentProjects.map(project => {
            const timeAgo = this.getTimeAgo(project.lastModified);
            const typeName = this.getTypeName(project.type);
            
            return `
                <div class="project-card" onclick="navigateToProject('${project.type}')">
                    <div class="project-header">
                        <div class="project-icon">${project.icon}</div>
                        <div class="project-info">
                            <div class="project-name">${project.name}</div>
                            <div class="project-meta">
                                <span class="project-type">${typeName}</span>
                                <span class="project-time">${timeAgo}</span>
                            </div>
                        </div>
                    </div>
                    <div class="project-description">${project.description}</div>
                    <div class="project-actions">
                        <button class="btn btn-small" onclick="event.stopPropagation(); openProject(${project.id})">
                            查看
                        </button>
                        <button class="btn btn-small btn-secondary" onclick="event.stopPropagation(); editProject(${project.id})">
                            编辑
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // 更新仪表盘统计信息
    updateDashboardStats() {
        const dataConfig = window.DataConfig || {};
        
        // 这里可以添加统计信息显示逻辑
        console.log('仪表盘统计信息已更新');
        console.log('数据源数量：', dataConfig.dataSources ? dataConfig.dataSources.length : 0);
        console.log('指标数量：', dataConfig.metrics ? dataConfig.metrics.length : 0);
        console.log('维度数量：', dataConfig.dimensions ? dataConfig.dimensions.length : 0);
        console.log('数据卡片数量：', dataConfig.dataCards ? dataConfig.dataCards.length : 0);
        console.log('报表数量：', dataConfig.reports ? dataConfig.reports.length : 0);
    }
    
    // 获取时间差描述
    getTimeAgo(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diffMs = now - time;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        
        if (diffDays > 0) {
            return `${diffDays}天前`;
        } else if (diffHours > 0) {
            return `${diffHours}小时前`;
        } else if (diffMinutes > 0) {
            return `${diffMinutes}分钟前`;
        } else {
            return '刚刚';
        }
    }
    
    // 获取类型名称
    getTypeName(type) {
        const typeMap = {
            'dashboard': '仪表盘',
            'report': '报表',
            'card': '数据卡片'
        };
        return typeMap[type] || type;
    }
}

// 全局函数
function showWelcomeGuide() {
    const modal = document.getElementById('welcomeGuideModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeWelcomeGuide() {
    const modal = document.getElementById('welcomeGuideModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function showTemplateGallery() {
    alert('模板库功能开发中...');
}

function showDemoData() {
    const dataConfig = window.DataConfig || {};
    const stats = {
        dataSources: dataConfig.dataSources ? dataConfig.dataSources.length : 0,
        metrics: dataConfig.metrics ? dataConfig.metrics.length : 0,
        dimensions: dataConfig.dimensions ? dataConfig.dimensions.length : 0,
        dataCards: dataConfig.dataCards ? dataConfig.dataCards.length : 0,
        reports: dataConfig.reports ? dataConfig.reports.length : 0
    };
    
    alert(`示例数据概览：\n\n数据源: ${stats.dataSources}个\n指标: ${stats.metrics}个\n维度: ${stats.dimensions}个\n数据卡片: ${stats.dataCards}个\n报表: ${stats.reports}个\n\n请访问各功能页面查看详细数据。`);
}

function navigateToProject(type) {
    switch (type) {
        case 'dashboard':
        case 'report':
            window.location.href = 'reports.html';
            break;
        case 'card':
            window.location.href = 'datacards.html';
            break;
        default:
            window.location.href = 'reports.html';
    }
}

function openProject(projectId) {
    alert(`打开项目 ID: ${projectId}`);
    // 这里可以添加具体的项目打开逻辑
}

function editProject(projectId) {
    alert(`编辑项目 ID: ${projectId}`);
    // 这里可以添加具体的项目编辑逻辑
}

// 模态框点击外部关闭
window.onclick = function(event) {
    const modal = document.getElementById('welcomeGuideModal');
    if (event.target === modal) {
        closeWelcomeGuide();
    }
}

// 页面加载完成后初始化
let homePageManager;
document.addEventListener('DOMContentLoaded', function() {
    homePageManager = new HomePageManager();
});

console.log('首页JavaScript文件已加载');