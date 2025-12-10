/**
 * 数据配置统一管理文件 - 整车网络安全CSMS平台
 * 集中管理所有数据源表结构和字段定义，确保数据一致性
 * 优化版本：支持按需加载和缓存机制
 */

// 数据源定义 - 整车网络安全CSMS平台相关数据
const dataSources = [
    {
        id: 1,
        name: '车辆安全监控数据源',
        type: 'iot',
        description: '包含车辆安全状态、传感器数据、异常检测等车辆安全监控数据',
        tables: ['vehicle_security_status', 'sensor_data', 'anomaly_detection', 'ecu_communication', 'vehicle_telemetry', 'security_events', 'firmware_updates', 'diagnostic_codes', 'can_bus_logs', 'driver_behavior']
    },
    {
        id: 2,
        name: '网络安全事件数据源',
        type: 'security',
        description: '包含网络安全事件、攻击检测、威胁情报等网络安全数据',
        tables: ['security_incidents', 'attack_detection', 'threat_intelligence', 'vulnerability_scan', 'firewall_logs', 'ids_ips_alerts', 'malware_analysis', 'access_control', 'network_traffic', 'compliance_audit']
    },
    {
        id: 3,
        name: '系统运行状态数据源',
        type: 'monitoring',
        description: '包含系统运行状态、性能指标、故障诊断等系统监控数据',
        tables: ['system_performance', 'hardware_status', 'software_inventory', 'backup_status', 'patch_management', 'log_analysis', 'resource_utilization', 'service_availability', 'capacity_planning', 'incident_management']
    }
];

// 数据源表映射 - 按数据源ID组织
const dataSourceTables = {
    '1': [ // 车辆安全监控数据源
        { value: 'vehicle_security_status', text: '车辆安全状态表 - 车辆安全状态监控 (vehicle_security_status)' },
        { value: 'sensor_data', text: '传感器数据表 - 车辆传感器采集数据 (sensor_data)' },
        { value: 'anomaly_detection', text: '异常检测表 - 安全异常事件检测 (anomaly_detection)' },
        { value: 'ecu_communication', text: 'ECU通信表 - 电子控制单元通信记录 (ecu_communication)' },
        { value: 'vehicle_telemetry', text: '车辆遥测表 - 车辆实时遥测数据 (vehicle_telemetry)' },
        { value: 'security_events', text: '安全事件表 - 车辆安全事件记录 (security_events)' },
        { value: 'firmware_updates', text: '固件更新表 - 固件版本更新历史 (firmware_updates)' },
        { value: 'diagnostic_codes', text: '诊断代码表 - 车辆诊断故障代码 (diagnostic_codes)' },
        { value: 'can_bus_logs', text: 'CAN总线日志表 - CAN总线通信记录 (can_bus_logs)' },
        { value: 'driver_behavior', text: '驾驶行为表 - 驾驶员行为分析数据 (driver_behavior)' }
    ],
    '2': [ // 网络安全事件数据源
        { value: 'security_incidents', text: '安全事件表 - 网络安全事件记录 (security_incidents)' },
        { value: 'attack_detection', text: '攻击检测表 - 网络攻击检测结果 (attack_detection)' },
        { value: 'threat_intelligence', text: '威胁情报表 - 威胁情报数据 (threat_intelligence)' },
        { value: 'vulnerability_scan', text: '漏洞扫描表 - 系统漏洞扫描结果 (vulnerability_scan)' },
        { value: 'firewall_logs', text: '防火墙日志表 - 防火墙访问日志 (firewall_logs)' },
        { value: 'ids_ips_alerts', text: '入侵检测表 - IDS/IPS告警信息 (ids_ips_alerts)' },
        { value: 'malware_analysis', text: '恶意软件分析表 - 恶意软件检测结果 (malware_analysis)' },
        { value: 'access_control', text: '访问控制表 - 访问权限控制记录 (access_control)' },
        { value: 'network_traffic', text: '网络流量表 - 网络流量分析数据 (network_traffic)' },
        { value: 'compliance_audit', text: '合规审计表 - 合规性审计结果 (compliance_audit)' }
    ],
    '3': [ // 系统运行状态数据源
        { value: 'system_performance', text: '系统性能表 - 系统性能指标监控 (system_performance)' },
        { value: 'hardware_status', text: '硬件状态表 - 硬件设备运行状态 (hardware_status)' },
        { value: 'software_inventory', text: '软件清单表 - 软件资产清单管理 (software_inventory)' },
        { value: 'backup_status', text: '备份状态表 - 数据备份状态监控 (backup_status)' },
        { value: 'patch_management', text: '补丁管理表 - 系统补丁管理记录 (patch_management)' },
        { value: 'log_analysis', text: '日志分析表 - 系统日志分析结果 (log_analysis)' },
        { value: 'resource_utilization', text: '资源利用表 - 系统资源使用情况 (resource_utilization)' },
        { value: 'service_availability', text: '服务可用性表 - 服务可用性监控 (service_availability)' },
        { value: 'capacity_planning', text: '容量规划表 - 系统容量规划数据 (capacity_planning)' },
        { value: 'incident_management', text: '事件管理表 - 系统事件处理记录 (incident_management)' }
    ]
};

// 表字段定义 - 每个数据表的详细字段结构
const tableFields = {
    // 车辆安全监控数据源表字段
    'vehicle_security_status': [
        { name: 'vehicle_id', type: 'varchar', description: '车辆ID' },
        { name: 'timestamp', type: 'datetime', description: '时间戳' },
        { name: 'security_level', type: 'varchar', description: '安全等级' },
        { name: 'ecu_status', type: 'json', description: 'ECU状态' },
        { name: 'can_bus_health', type: 'decimal', description: 'CAN总线健康度' },
        { name: 'encryption_status', type: 'varchar', description: '加密状态' },
        { name: 'authentication_status', type: 'varchar', description: '认证状态' },
        { name: 'firmware_version', type: 'varchar', description: '固件版本' },
        { name: 'last_secure_boot', type: 'datetime', description: '最后安全启动时间' },
        { name: 'threat_detected', type: 'boolean', description: '威胁检测' }
    ],
    'sensor_data': [
        { name: 'sensor_id', type: 'varchar', description: '传感器ID' },
        { name: 'vehicle_id', type: 'varchar', description: '车辆ID' },
        { name: 'timestamp', type: 'datetime', description: '采集时间' },
        { name: 'sensor_type', type: 'varchar', description: '传感器类型' },
        { name: 'value', type: 'decimal', description: '传感器数值' },
        { name: 'unit', type: 'varchar', description: '单位' },
        { name: 'status', type: 'varchar', description: '传感器状态' },
        { name: 'confidence', type: 'decimal', description: '置信度' },
        { name: 'location', type: 'varchar', description: '安装位置' }
    ],
    'anomaly_detection': [
        { name: 'anomaly_id', type: 'int', description: '异常ID' },
        { name: 'vehicle_id', type: 'varchar', description: '车辆ID' },
        { name: 'detection_time', type: 'datetime', description: '检测时间' },
        { name: 'anomaly_type', type: 'varchar', description: '异常类型' },
        { name: 'severity', type: 'varchar', description: '严重程度' },
        { name: 'affected_component', type: 'varchar', description: '影响组件' },
        { name: 'confidence_score', type: 'decimal', description: '置信度评分' },
        { name: 'mitigation_action', type: 'varchar', description: '缓解措施' },
        { name: 'status', type: 'varchar', description: '处理状态' }
    ],
    'ecu_communication': [
        { name: 'ecu_id', type: 'varchar', description: 'ECU ID' },
        { name: 'vehicle_id', type: 'varchar', description: '车辆ID' },
        { name: 'communication_time', type: 'datetime', description: '通信时间' },
        { name: 'message_type', type: 'varchar', description: '消息类型' },
        { name: 'source_ecu', type: 'varchar', description: '源ECU' },
        { name: 'destination_ecu', type: 'varchar', description: '目标ECU' },
        { name: 'message_size', type: 'int', description: '消息大小' },
        { name: 'encryption_status', type: 'varchar', description: '加密状态' },
        { name: 'integrity_check', type: 'boolean', description: '完整性检查' }
    ],
    'vehicle_telemetry': [
        { name: 'telemetry_id', type: 'int', description: '遥测ID' },
        { name: 'vehicle_id', type: 'varchar', description: '车辆ID' },
        { name: 'timestamp', type: 'datetime', description: '时间戳' },
        { name: 'speed', type: 'decimal', description: '车速' },
        { name: 'engine_rpm', type: 'int', description: '发动机转速' },
        { name: 'battery_voltage', type: 'decimal', description: '电池电压' },
        { name: 'gps_latitude', type: 'decimal', description: 'GPS纬度' },
        { name: 'gps_longitude', type: 'decimal', description: 'GPS经度' },
        { name: 'fuel_level', type: 'decimal', description: '燃油水平' },
        { name: 'odometer', type: 'int', description: '里程表读数' }
    ],
    'security_events': [
        { name: 'event_id', type: 'int', description: '事件ID' },
        { name: 'vehicle_id', type: 'varchar', description: '车辆ID' },
        { name: 'event_time', type: 'datetime', description: '事件时间' },
        { name: 'event_type', type: 'varchar', description: '事件类型' },
        { name: 'severity', type: 'varchar', description: '严重程度' },
        { name: 'description', type: 'text', description: '事件描述' },
        { name: 'affected_systems', type: 'json', description: '影响系统' },
        { name: 'response_action', type: 'varchar', description: '响应措施' },
        { name: 'status', type: 'varchar', description: '事件状态' }
    ],
    'firmware_updates': [
        { name: 'update_id', type: 'int', description: '更新ID' },
        { name: 'vehicle_id', type: 'varchar', description: '车辆ID' },
        { name: 'ecu_id', type: 'varchar', description: 'ECU ID' },
        { name: 'update_time', type: 'datetime', description: '更新时间' },
        { name: 'old_version', type: 'varchar', description: '旧版本' },
        { name: 'new_version', type: 'varchar', description: '新版本' },
        { name: 'update_type', type: 'varchar', description: '更新类型' },
        { name: 'verification_status', type: 'varchar', description: '验证状态' },
        { name: 'rollback_possible', type: 'boolean', description: '可回滚' }
    ],
    'diagnostic_codes': [
        { name: 'code_id', type: 'varchar', description: '代码ID' },
        { name: 'vehicle_id', type: 'varchar', description: '车辆ID' },
        { name: 'ecu_id', type: 'varchar', description: 'ECU ID' },
        { name: 'detection_time', type: 'datetime', description: '检测时间' },
        { name: 'code_number', type: 'varchar', description: '故障代码' },
        { name: 'description', type: 'varchar', description: '故障描述' },
        { name: 'severity', type: 'varchar', description: '严重程度' },
        { name: 'status', type: 'varchar', description: '状态' }
    ],
    'can_bus_logs': [
        { name: 'log_id', type: 'int', description: '日志ID' },
        { name: 'vehicle_id', type: 'varchar', description: '车辆ID' },
        { name: 'timestamp', type: 'datetime', description: '时间戳' },
        { name: 'message_id', type: 'varchar', description: '消息ID' },
        { name: 'data_length', type: 'int', description: '数据长度' },
        { name: 'data_payload', type: 'varchar', description: '数据载荷' },
        { name: 'source_ecu', type: 'varchar', description: '源ECU' },
        { name: 'destination_ecu', type: 'varchar', description: '目标ECU' },
        { name: 'priority', type: 'int', description: '优先级' }
    ],
    'driver_behavior': [
        { name: 'behavior_id', type: 'int', description: '行为ID' },
        { name: 'vehicle_id', type: 'varchar', description: '车辆ID' },
        { name: 'driver_id', type: 'varchar', description: '驾驶员ID' },
        { name: 'timestamp', type: 'datetime', description: '时间戳' },
        { name: 'behavior_type', type: 'varchar', description: '行为类型' },
        { name: 'score', type: 'decimal', description: '行为评分' },
        { name: 'duration', type: 'int', description: '持续时间' },
        { name: 'impact_on_security', type: 'varchar', description: '安全影响' }
    ],
    
    // 网络安全事件数据源表字段
    'security_incidents': [
        { name: 'incident_id', type: 'int', description: '事件ID' },
        { name: 'timestamp', type: 'datetime', description: '时间戳' },
        { name: 'incident_type', type: 'varchar', description: '事件类型' },
        { name: 'severity', type: 'varchar', description: '严重程度' },
        { name: 'affected_systems', type: 'json', description: '影响系统' },
        { name: 'detection_method', type: 'varchar', description: '检测方法' },
        { name: 'mitigation_status', type: 'varchar', description: '缓解状态' },
        { name: 'assigned_team', type: 'varchar', description: '负责团队' }
    ],
    'attack_detection': [
        { name: 'detection_id', type: 'int', description: '检测ID' },
        { name: 'timestamp', type: 'datetime', description: '时间戳' },
        { name: 'attack_type', type: 'varchar', description: '攻击类型' },
        { name: 'source_ip', type: 'varchar', description: '源IP' },
        { name: 'target_ip', type: 'varchar', description: '目标IP' },
        { name: 'confidence_score', type: 'decimal', description: '置信度评分' },
        { name: 'prevented', type: 'boolean', description: '是否阻止' },
        { name: 'action_taken', type: 'varchar', description: '采取行动' }
    ],
    'threat_intelligence': [
        { name: 'threat_id', type: 'int', description: '威胁ID' },
        { name: 'timestamp', type: 'datetime', description: '时间戳' },
        { name: 'threat_type', type: 'varchar', description: '威胁类型' },
        { name: 'risk_level', type: 'varchar', description: '风险等级' },
        { name: 'source', type: 'varchar', description: '来源' },
        { name: 'affected_platforms', type: 'json', description: '影响平台' },
        { name: 'mitigation_advice', type: 'text', description: '缓解建议' },
        { name: 'validity_period', type: 'datetime', description: '有效期' }
    ],
    'vulnerability_scan': [
        { name: 'scan_id', type: 'int', description: '扫描ID' },
        { name: 'scan_time', type: 'datetime', description: '扫描时间' },
        { name: 'target_system', type: 'varchar', description: '目标系统' },
        { name: 'vulnerability_count', type: 'int', description: '漏洞数量' },
        { name: 'critical_count', type: 'int', description: '严重漏洞数' },
        { name: 'high_count', type: 'int', description: '高危漏洞数' },
        { name: 'medium_count', type: 'int', description: '中危漏洞数' },
        { name: 'scan_status', type: 'varchar', description: '扫描状态' }
    ],
    'firewall_logs': [
        { name: 'log_id', type: 'int', description: '日志ID' },
        { name: 'timestamp', type: 'datetime', description: '时间戳' },
        { name: 'source_ip', type: 'varchar', description: '源IP' },
        { name: 'destination_ip', type: 'varchar', description: '目标IP' },
        { name: 'port', type: 'int', description: '端口' },
        { name: 'protocol', type: 'varchar', description: '协议' },
        { name: 'action', type: 'varchar', description: '动作' },
        { name: 'rule_applied', type: 'varchar', description: '应用规则' }
    ],
    'ids_ips_alerts': [
        { name: 'alert_id', type: 'int', description: '告警ID' },
        { name: 'timestamp', type: 'datetime', description: '时间戳' },
        { name: 'alert_type', type: 'varchar', description: '告警类型' },
        { name: 'severity', type: 'varchar', description: '严重程度' },
        { name: 'source_ip', type: 'varchar', description: '源IP' },
        { name: 'destination_ip', type: 'varchar', description: '目标IP' },
        { name: 'signature_id', type: 'varchar', description: '签名ID' },
        { name: 'action_taken', type: 'varchar', description: '采取行动' }
    ],
    'malware_analysis': [
        { name: 'analysis_id', type: 'int', description: '分析ID' },
        { name: 'timestamp', type: 'datetime', description: '时间戳' },
        { name: 'file_name', type: 'varchar', description: '文件名' },
        { name: 'file_hash', type: 'varchar', description: '文件哈希' },
        { name: 'malware_family', type: 'varchar', description: '恶意软件家族' },
        { name: 'threat_level', type: 'varchar', description: '威胁等级' },
        { name: 'detection_method', type: 'varchar', description: '检测方法' },
        { name: 'quarantine_status', type: 'varchar', description: '隔离状态' }
    ],
    'access_control': [
        { name: 'access_id', type: 'int', description: '访问ID' },
        { name: 'timestamp', type: 'datetime', description: '时间戳' },
        { name: 'user_id', type: 'varchar', description: '用户ID' },
        { name: 'resource', type: 'varchar', description: '资源' },
        { name: 'action', type: 'varchar', description: '操作' },
        { name: 'result', type: 'varchar', description: '结果' },
        { name: 'ip_address', type: 'varchar', description: 'IP地址' },
        { name: 'authentication_method', type: 'varchar', description: '认证方法' }
    ],
    'network_traffic': [
        { name: 'traffic_id', type: 'int', description: '流量ID' },
        { name: 'timestamp', type: 'datetime', description: '时间戳' },
        { name: 'source_ip', type: 'varchar', description: '源IP' },
        { name: 'destination_ip', type: 'varchar', description: '目标IP' },
        { name: 'bytes_sent', type: 'bigint', description: '发送字节数' },
        { name: 'bytes_received', type: 'bigint', description: '接收字节数' },
        { name: 'protocol', type: 'varchar', description: '协议' },
        { name: 'port', type: 'int', description: '端口' }
    ],
    'compliance_audit': [
        { name: 'audit_id', type: 'int', description: '审计ID' },
        { name: 'audit_date', type: 'datetime', description: '审计日期' },
        { name: 'standard', type: 'varchar', description: '标准' },
        { name: 'compliance_score', type: 'decimal', description: '合规得分' },
        { name: 'findings_count', type: 'int', description: '发现项数量' },
        { name: 'critical_findings', type: 'int', description: '关键发现项' },
        { name: 'auditor', type: 'varchar', description: '审计员' },
        { name: 'status', type: 'varchar', description: '状态' }
    ],
    
    // 系统运行状态数据源表字段
    'system_performance': [
        { name: 'performance_id', type: 'int', description: '性能ID' },
        { name: 'timestamp', type: 'datetime', description: '时间戳' },
        { name: 'cpu_usage', type: 'decimal', description: 'CPU使用率' },
        { name: 'memory_usage', type: 'decimal', description: '内存使用率' },
        { name: 'disk_usage', type: 'decimal', description: '磁盘使用率' },
        { name: 'network_throughput', type: 'decimal', description: '网络吞吐量' },
        { name: 'response_time', type: 'decimal', description: '响应时间' },
        { name: 'uptime', type: 'int', description: '运行时间' }
    ],
    'hardware_status': [
        { name: 'hardware_id', type: 'varchar', description: '硬件ID' },
        { name: 'timestamp', type: 'datetime', description: '时间戳' },
        { name: 'component_type', type: 'varchar', description: '组件类型' },
        { name: 'status', type: 'varchar', description: '状态' },
        { name: 'temperature', type: 'decimal', description: '温度' },
        { name: 'power_consumption', type: 'decimal', description: '功耗' },
        { name: 'health_score', type: 'decimal', description: '健康评分' },
        { name: 'last_maintenance', type: 'datetime', description: '最后维护' }
    ],
    'software_inventory': [
        { name: 'software_id', type: 'int', description: '软件ID' },
        { name: 'name', type: 'varchar', description: '软件名称' },
        { name: 'version', type: 'varchar', description: '版本' },
        { name: 'vendor', type: 'varchar', description: '供应商' },
        { name: 'installation_date', type: 'datetime', description: '安装日期' },
        { name: 'license_status', type: 'varchar', description: '许可状态' },
        { name: 'security_status', type: 'varchar', description: '安全状态' },
        { name: 'last_update', type: 'datetime', description: '最后更新' }
    ],
    'backup_status': [
        { name: 'backup_id', type: 'int', description: '备份ID' },
        { name: 'backup_time', type: 'datetime', description: '备份时间' },
        { name: 'backup_type', type: 'varchar', description: '备份类型' },
        { name: 'size_gb', type: 'decimal', description: '大小(GB)' },
        { name: 'status', type: 'varchar', description: '状态' },
        { name: 'verification_status', type: 'varchar', description: '验证状态' },
        { name: 'retention_days', type: 'int', description: '保留天数' }
    ],
    'patch_management': [
        { name: 'patch_id', type: 'int', description: '补丁ID' },
        { name: 'patch_date', type: 'datetime', description: '补丁日期' },
        { name: 'software_name', type: 'varchar', description: '软件名称' },
        { name: 'patch_version', type: 'varchar', description: '补丁版本' },
        { name: 'severity', type: 'varchar', description: '严重程度' },
        { name: 'status', type: 'varchar', description: '状态' },
        { name: 'rollback_possible', type: 'boolean', description: '可回滚' }
    ],
    'log_analysis': [
        { name: 'analysis_id', type: 'int', description: '分析ID' },
        { name: 'analysis_time', type: 'datetime', description: '分析时间' },
        { name: 'log_source', type: 'varchar', description: '日志源' },
        { name: 'error_count', type: 'int', description: '错误数量' },
        { name: 'warning_count', type: 'int', description: '警告数量' },
        { name: 'critical_events', type: 'int', description: '关键事件数' },
        { name: 'trend', type: 'varchar', description: '趋势' }
    ],
    'resource_utilization': [
        { name: 'utilization_id', type: 'int', description: '利用ID' },
        { name: 'timestamp', type: 'datetime', description: '时间戳' },
        { name: 'resource_type', type: 'varchar', description: '资源类型' },
        { name: 'utilization_percent', type: 'decimal', description: '利用率百分比' },
        { name: 'capacity', type: 'decimal', description: '容量' },
        { name: 'available', type: 'decimal', description: '可用量' },
        { name: 'threshold', type: 'decimal', description: '阈值' }
    ],
    'service_availability': [
        { name: 'service_id', type: 'varchar', description: '服务ID' },
        { name: 'timestamp', type: 'datetime', description: '时间戳' },
        { name: 'availability_percent', type: 'decimal', description: '可用性百分比' },
        { name: 'downtime_minutes', type: 'int', description: '宕机时间(分钟)' },
        { name: 'incident_count', type: 'int', description: '事件数量' },
        { name: 'response_time_avg', type: 'decimal', description: '平均响应时间' },
        { name: 'sla_compliance', type: 'boolean', description: 'SLA合规' }
    ],
    'capacity_planning': [
        { name: 'plan_id', type: 'int', description: '规划ID' },
        { name: 'plan_date', type: 'datetime', description: '规划日期' },
        { name: 'resource_type', type: 'varchar', description: '资源类型' },
        { name: 'current_usage', type: 'decimal', description: '当前使用量' },
        { name: 'projected_usage', type: 'decimal', description: '预计使用量' },
        { name: 'growth_rate', type: 'decimal', description: '增长率' },
        { name: 'recommendation', type: 'text', description: '建议' }
    ],
    'incident_management': [
        { name: 'incident_id', type: 'int', description: '事件ID' },
        { name: 'incident_time', type: 'datetime', description: '事件时间' },
        { name: 'severity', type: 'varchar', description: '严重程度' },
        { name: 'affected_services', type: 'json', description: '影响服务' },
        { name: 'resolution_time', type: 'datetime', description: '解决时间' },
        { name: 'root_cause', type: 'varchar', description: '根本原因' },
        { name: 'status', type: 'varchar', description: '状态' }
    ]
};

// 维度字段映射 - 用于维度配置
const dimensionFields = {
    // 车辆安全监控数据源表维度字段
    'vehicle_security_status': [
        { value: 'timestamp', text: '时间戳 (timestamp)' },
        { value: 'security_level', text: '安全等级 (security_level)' },
        { value: 'firmware_version', text: '固件版本 (firmware_version)' },
        { value: 'encryption_status', text: '加密状态 (encryption_status)' },
        { value: 'authentication_status', text: '认证状态 (authentication_status)' }
    ],
    'sensor_data': [
        { value: 'timestamp', text: '采集时间 (timestamp)' },
        { value: 'sensor_type', text: '传感器类型 (sensor_type)' },
        { value: 'location', text: '安装位置 (location)' },
        { value: 'status', text: '传感器状态 (status)' },
        { value: 'vehicle_id', text: '车辆ID (vehicle_id)' }
    ],
    'anomaly_detection': [
        { value: 'detection_time', text: '检测时间 (detection_time)' },
        { value: 'anomaly_type', text: '异常类型 (anomaly_type)' },
        { value: 'severity', text: '严重程度 (severity)' },
        { value: 'affected_component', text: '影响组件 (affected_component)' },
        { value: 'status', text: '处理状态 (status)' }
    ],
    'ecu_communication': [
        { value: 'communication_time', text: '通信时间 (communication_time)' },
        { value: 'message_type', text: '消息类型 (message_type)' },
        { value: 'source_ecu', text: '源ECU (source_ecu)' },
        { value: 'destination_ecu', text: '目标ECU (destination_ecu)' },
        { value: 'encryption_status', text: '加密状态 (encryption_status)' }
    ],
    'vehicle_telemetry': [
        { value: 'timestamp', text: '时间戳 (timestamp)' },
        { value: 'vehicle_id', text: '车辆ID (vehicle_id)' },
        { value: 'gps_latitude', text: 'GPS纬度 (gps_latitude)' },
        { value: 'gps_longitude', text: 'GPS经度 (gps_longitude)' },
        { value: 'speed', text: '车速 (speed)' }
    ],
    
    // 网络安全事件数据源表维度字段
    'security_incidents': [
        { value: 'timestamp', text: '时间戳 (timestamp)' },
        { value: 'incident_type', text: '事件类型 (incident_type)' },
        { value: 'severity', text: '严重程度 (severity)' },
        { value: 'detection_method', text: '检测方法 (detection_method)' },
        { value: 'assigned_team', text: '负责团队 (assigned_team)' }
    ],
    'attack_detection': [
        { value: 'timestamp', text: '时间戳 (timestamp)' },
        { value: 'attack_type', text: '攻击类型 (attack_type)' },
        { value: 'source_ip', text: '源IP (source_ip)' },
        { value: 'target_ip', text: '目标IP (target_ip)' },
        { value: 'prevented', text: '是否阻止 (prevented)' }
    ],
    'threat_intelligence': [
        { value: 'timestamp', text: '时间戳 (timestamp)' },
        { value: 'threat_type', text: '威胁类型 (threat_type)' },
        { value: 'risk_level', text: '风险等级 (risk_level)' },
        { value: 'source', text: '来源 (source)' },
        { value: 'validity_period', text: '有效期 (validity_period)' }
    ],
    'vulnerability_scan': [
        { value: 'scan_time', text: '扫描时间 (scan_time)' },
        { value: 'target_system', text: '目标系统 (target_system)' },
        { value: 'critical_count', text: '严重漏洞数 (critical_count)' },
        { value: 'high_count', text: '高危漏洞数 (high_count)' },
        { value: 'scan_status', text: '扫描状态 (scan_status)' }
    ],
    
    // 系统运行状态数据源表维度字段
    'system_performance': [
        { value: 'timestamp', text: '时间戳 (timestamp)' },
        { value: 'cpu_usage', text: 'CPU使用率 (cpu_usage)' },
        { value: 'memory_usage', text: '内存使用率 (memory_usage)' },
        { value: 'disk_usage', text: '磁盘使用率 (disk_usage)' },
        { value: 'response_time', text: '响应时间 (response_time)' }
    ],
    'hardware_status': [
        { value: 'timestamp', text: '时间戳 (timestamp)' },
        { value: 'component_type', text: '组件类型 (component_type)' },
        { value: 'status', text: '状态 (status)' },
        { value: 'temperature', text: '温度 (temperature)' },
        { value: 'health_score', text: '健康评分 (health_score)' }
    ],
    'software_inventory': [
        { value: 'name', text: '软件名称 (name)' },
        { value: 'version', text: '版本 (version)' },
        { value: 'vendor', text: '供应商 (vendor)' },
        { value: 'license_status', text: '许可状态 (license_status)' },
        { value: 'security_status', text: '安全状态 (security_status)' }
    ],
    'service_availability': [
        { value: 'timestamp', text: '时间戳 (timestamp)' },
        { value: 'service_id', text: '服务ID (service_id)' },
        { value: 'availability_percent', text: '可用性百分比 (availability_percent)' },
        { value: 'downtime_minutes', text: '宕机时间(分钟) (downtime_minutes)' },
        { value: 'sla_compliance', text: 'SLA合规 (sla_compliance)' }
    ]
};

// 表关系映射 - 用于跨表关联验证
const tableRelationships = {
    // 车辆安全监控数据源表间关联
    'vehicle_security_status': ['sensor_data', 'anomaly_detection', 'ecu_communication', 'vehicle_telemetry'],
    'sensor_data': ['vehicle_security_status', 'anomaly_detection'],
    'anomaly_detection': ['vehicle_security_status', 'sensor_data', 'security_events'],
    'ecu_communication': ['vehicle_security_status', 'can_bus_logs'],
    'vehicle_telemetry': ['vehicle_security_status', 'driver_behavior'],
    'security_events': ['anomaly_detection', 'firmware_updates'],
    'firmware_updates': ['ecu_communication', 'security_events'],
    'diagnostic_codes': ['ecu_communication', 'vehicle_security_status'],
    'can_bus_logs': ['ecu_communication'],
    'driver_behavior': ['vehicle_telemetry'],
    
    // 网络安全事件数据源表间关联
    'security_incidents': ['attack_detection', 'threat_intelligence'],
    'attack_detection': ['security_incidents', 'firewall_logs', 'ids_ips_alerts'],
    'threat_intelligence': ['security_incidents', 'vulnerability_scan'],
    'vulnerability_scan': ['threat_intelligence', 'compliance_audit'],
    'firewall_logs': ['attack_detection', 'network_traffic'],
    'ids_ips_alerts': ['attack_detection', 'malware_analysis'],
    'malware_analysis': ['ids_ips_alerts', 'access_control'],
    'access_control': ['malware_analysis'],
    'network_traffic': ['firewall_logs'],
    'compliance_audit': ['vulnerability_scan'],
    
    // 系统运行状态数据源表间关联
    'system_performance': ['hardware_status', 'resource_utilization'],
    'hardware_status': ['system_performance', 'software_inventory'],
    'software_inventory': ['hardware_status', 'patch_management'],
    'backup_status': [],
    'patch_management': ['software_inventory', 'log_analysis'],
    'log_analysis': ['patch_management', 'incident_management'],
    'resource_utilization': ['system_performance', 'capacity_planning'],
    'service_availability': ['incident_management'],
    'capacity_planning': ['resource_utilization'],
    'incident_management': ['log_analysis', 'service_availability']
};

// 字段到表的映射 - 用于智能推断
const fieldToTableMap = {
    // 车辆安全监控数据源字段映射
    'timestamp': 'vehicle_security_status',
    'vehicle_id': 'vehicle_security_status',
    'security_level': 'vehicle_security_status',
    'sensor_type': 'sensor_data',
    'sensor_value': 'sensor_data',
    'anomaly_type': 'anomaly_detection',
    'severity': 'anomaly_detection',
    'ecu_id': 'ecu_communication',
    'message_type': 'ecu_communication',
    
    // 网络安全事件数据源字段映射
    'incident_type': 'security_incidents',
    'attack_type': 'attack_detection',
    'source_ip': 'attack_detection',
    'target_ip': 'attack_detection',
    'threat_type': 'threat_intelligence',
    'risk_level': 'threat_intelligence',
    'vulnerability_count': 'vulnerability_scan',
    'critical_count': 'vulnerability_scan',
    
    // 系统运行状态数据源字段映射
    'cpu_usage': 'system_performance',
    'memory_usage': 'system_performance',
    'disk_usage': 'system_performance',
    'component_type': 'hardware_status',
    'temperature': 'hardware_status',
    'availability_percent': 'service_availability',
    'downtime_minutes': 'service_availability',
    
    // 指标字段映射
    'confidence_score': 'anomaly_detection',
    'can_bus_health': 'vehicle_security_status',
    'firmware_version': 'vehicle_security_status',
    'scan_status': 'vulnerability_scan',
    'performance_score': 'system_performance',
    'response_time': 'service_availability',
    'health_score': 'hardware_status'
};

// 示例指标数据
const metrics = [
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

// 示例维度数据
const dimensions = [
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

// 示例数据卡片数据
const dataCards = [
    {
        id: 1,
        name: '车辆安全监控KPI',
        type: 'kpi',
        metricId: 1,
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
        id: 2,
        name: '网络安全事件趋势分析',
        type: 'line',
        metricId: 4,
        dimensionId: 1,
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
        id: 3,
        name: '车辆安全事件明细表',
        type: 'table',
        metricId: null,
        metricIds: [1, 2, 3],
        dimensionId: 1,
        config: {
            metricIds: [1, 2, 3],
            columns: 6,
            pageSize: 10,
            dimensionUsage: 'grouping'
        },
        description: '按时间维度分组显示车辆安全事件的详细统计信息',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

// 示例报表数据
const reports = [
    {
        id: 1,
        name: '车辆安全监控仪表盘',
        type: 'dashboard',
        dataCardIds: [1, 2, 3],
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
    }
];

// 全局数据配置对象 - 简化版本
window.DataConfig = {
    // 数据加载状态
    isLoaded: true, // 直接设置为已加载，避免等待逻辑
    
    // 直接导出数据
    dataSources: dataSources,
    dataSourceTables: dataSourceTables,
    tableFields: tableFields,
    dimensionFields: dimensionFields,
    tableRelationships: tableRelationships,
    fieldToTableMap: fieldToTableMap,
    metrics: metrics,
    dimensions: dimensions,
    dataCards: dataCards,
    reports: reports
};

console.log('数据配置文件已加载 - 简化版本');
console.log('数据源数量：', window.DataConfig.dataSources.length);
console.log('指标数量：', window.DataConfig.metrics.length);
console.log('维度数量：', window.DataConfig.dimensions.length);
console.log('数据卡片数量：', window.DataConfig.dataCards.length);
console.log('报表数量：', window.DataConfig.reports.length);