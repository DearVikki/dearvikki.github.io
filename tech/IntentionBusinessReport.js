//意向业务报表
Ext.define('ReportManage.panel.IntentionBusinessReport', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.rm.intentionbusinessreport',
    requires: [
    	"ReportManage.controller.IntentionBusinessReportController"
    ],
    controller: "rm.intentionbusinessreportcontroller",
    viewModel: true,
    border: false,
    cls: "PMPerformancePanel ztitgrid",
    selModel : {
    	type : 'checkboxmodel'
    },
    
    initComponent: function() {
        var me = this;
		me.store=Ext.create("ReportManage.store.IntentionBusinessReportStore");
		me.orgStore = Ext.create('ReportManage.store.OrgPermissionSortStore'); //区域
		me.orgStore.proxy.extraParams = {
			permissionId : 'BusinessReportQuery'
		}
		me.orgStore.load();
		me.subOrgStore = Ext.create('ReportManage.store.SubOrgStore');//分公司
		me.fieldStore = Ext.create('ReportManage.store.FieldManageStore');
		me.fieldStore.load();
		me.constructStyleStore = Ext.create('ReportManage.store.FieldValueGetStore'); //结构形式查找筛选使用
		me.constructStyleStore.proxy.extraParams = {
			fieldId : 'constructStyle'
		};
		me.constructStyleStore.load();
		me.orgCode = ReportManageOrgCode;//全局变量 在 ReportManage.MarketReport里
        Ext.apply(me, {
    		columnLines: true,
			listeners : {
				itemdblclick : 'onitemdblclick',
				select : 'onselect',
				scope:me.controller
			},
            columns: [
                {xtype: 'rownumberer',tdCls : 'tdValign', text: '<b>序号</b>',width: 50,align : 'center'},
                {dataIndex: 'id',tdCls : 'tdValign',align : 'center',text: 'ID', width: 100,hidden:true,renderer: 'onrender'},
                {dataIndex: 'reportYear',tdCls : 'tdValign',align : 'center',text: '<b>年</b>', width: 60,locked: true},
                {dataIndex: 'reportMonth',tdCls : 'tdValign',align : 'center',text: '<b>月</b>', width: 40,locked: true},
                {dataIndex: 'subOrgName',tdCls : 'tdValign',align : 'center',text: '<b>所属公司</b>' ,width: 120,renderer: 'onrender',locked: true},
                {dataIndex: 'projectName',tdCls : 'tdValign',align : 'center',text: '<b>工程名称</b>', width: 120,renderer: 'onrender',locked: true},
                {dataIndex: 'intentionAuditStatu',tdCls : 'tdValign',align: 'center',text: '<b>审核<br>状态</b>',width: 60,locked: true},
                {
                	xtype : 'actioncolumn',tdCls : 'tdValign',sortable : false,menuDisabled : true,align : 'center',text: '<b>能否转入业务<br>(绿色箭头能转)</b>', width: 120,locked: true,
                	dataIndex : 'intentionStatu',
                	renderer : function(v, td, record){
                		var intentionAuditStatu = record.get('intentionAuditStatu');
                		if(v == '未转移' && intentionAuditStatu .indexOf('已审核')!=-1 ){ //未转移且已审核
                			this.items[0].icon = "../images/forward.gif"
                		}else if(v=='已转移'){
                			this.items[0].icon = "../images/transferred.png"
                		}else if(v=='已删除'){
                			this.items[0].icon = "../images/had_delete.png"
                		}else {
                			this.items[0].icon = "../images/forwardgrey.gif"  //不可转移标识
                		}
                	},
                	items : [{
                		icon : '../images/forward.gif',
                		tooltip : '转入业务',
						handler : function(grid, rowIndex, colIndex){
							var rec = grid.getStore().getAt(rowIndex);
							var message = '确定将 <font style="color:red">'+rec.get('projectName')+'</font> 转入正式业务?';
							var businessStore = me.up('#businessmaincardpanel').items.items[0].getStore();//正式业务store
							if(rec.get('intentionAuditStatu').indexOf('未审核')!=-1 || rec.get('intentionStatu')=='已转移' || rec.get('intentionStatu')=='已删除'){
								Ext.Msg.alert('提示','对不起,该意向业务还未审核或已被转移或已删除!');
							}else{
								Ext.Msg.confirm('提示',message,function(btn){
									if(btn == 'yes'){
										var win = Ext.create('ReportManage.window.BusinessReportAddWin',{
											title : "意向业务转移",
											
											contractFlag : 'change',
											method : 'changeToBusinessReport',
											gridStore : businessStore,
											intentionGridStore : grid.getStore(),
											businessType : 0,
											hasExamine : 0
										});
										win.down('form').down('button[text=重置]').setVisible(false);//不允许重置
										var form = win.down('form').getForm();
										form.loadRecord(rec); //加载数据
										form.findField('reportYear').setValue(new Date().getFullYear());
										form.findField('reportMonth').setValue(new Date().getMonth()+1);
										form.findField('subOrgName').setReadOnly(true);
										var subOrgId = rec.get('subOrgId');
										if(subOrgId == 'ZTJS0019'){
											form.findField('isBeGeneralScope').setHidden(false);
										}
										var year = new Date().getFullYear();
										var orgCode = me.orgCode[subOrgId];
										var projectCode = "";
										if(orgCode!=null){
											projectCode = orgCode+'-'+year+"-";
										}else{
											projectCode = "该公司编码未定,请确认这是分公司或联系管理员";
										}
										form.findField('projectCode').setValue(projectCode);
										form.findField('projectCode').regex = /^[a-z0-9A-Z]{0,}[\-][0-9]{4,4}[\-][0-9]{3,3}$/
										form.findField('projectCode').validator = function(val){
											return val.indexOf(orgCode+'-')==0?true:'请直接在末尾增添3位数的流水号，不要随意更改分公司的编码';
										}
										win.show();
									}
								})
							}
						}
                	}]
                },
                {dataIndex: 'buildUnit',tdCls : 'tdValign',align : 'center',text: '<b>建设单位</b>', width:120,renderer: 'onrender'},
                {dataIndex: 'constructStyle',tdCls : 'tdValign',align : 'center',text: '<b>结构形式</b>', width: 140,renderer: 'constructStyleRender'},
                {dataIndex: 'contractPrice',tdCls : 'tdValign',align : 'center',text: '<b>合同造价<br>(万元)</b>', width: 100},
            	{dataIndex: 'constructionArea',tdCls : 'tdValign',align : 'center',text: '<b>建筑面积<br>(m²)</b>', width: 100},
                {dataIndex: 'projectManager',tdCls : 'tdValign',align : 'center',text: '<b>项目经济<br>责任人</b>', width: 80},
                {dataIndex: 'reportMan',tdCls : 'tdValign',align : 'center',text: '<b>创建者</b>', width: 80},
                {dataIndex: 'reportDate',tdCls : 'tdValign',align : 'center',text: '<b>创建日期</b>', width: 100},
                {dataIndex: 'lastReportMan',tdCls : 'tdValign',align : 'center',text: '<b>最后修改人</b>', hidden:true, width: 90},
                {dataIndex: 'lastReportDate',tdCls : 'tdValign',align : 'center',text: '<b>最后修改日期</b>', hidden:true, width: 100}
            ],
            dockedItems: [
            {
							xtype : 'toolbar',
							itemId : 'query1',
							enableOverflow : true,
							overflowHandler: 'scroller',
							dock : 'top',
							defaults : {
								labelWidth : 60,
								labelAlign : 'right',
								width : 200
							},
							items : ['-','-',{
								xtype : 'combo',
								fieldLabel : '年',
								labelWidth : 15,
								width : 105,
								name: 'year',
								forceSelection : true,
								queryMode: 'local',
								displayField: 'year',
					  			valueField: 'year',
								store : {type : 'yearstore'}
							},'-',{
								xtype : 'combo',
								fieldLabel : '月',
								labelWidth : 15,
								width : 90,
								name: 'month',
								forceSelection : true,
								queryMode: 'local',
								displayField: 'month',
					  			valueField: 'month',
								store : {type : 'monthstore'}
							},'-',{
								xtype : 'combo',
								fieldLabel : '所属区域',
								labelWidth : 30,
								labelSeparator: '',
								name: 'orgId',
								queryMode: 'local',
								displayField: 'subOrgName',
					  			valueField: 'subOrgId',
								store : me.orgStore,
								flex : 1,
								minWidth : 140,
								listeners : {
									select : function(combo,record){
										var subOrg = combo.up('#query1').down('combo[name=subOrgId]');
										subOrg.reset();
										subOrg.getStore().filter('parentId', record.get('subOrgId'));
									}
								}
							},'-',{
								xtype : 'combo',
								fieldLabel : '所属公司',
								labelWidth : 30,
								labelSeparator: '',
								name: 'subOrgId',
								queryMode: 'local',
								displayField: 'orgName',
					  			valueField: 'orgId',
								store : me.subOrgStore,
								flex : 1,
								minWidth : 140
							},'-',{
								xtype : 'textfield',
								fieldLabel : '工程名称',
								labelWidth : 30,
								labelSeparator: '',
								emptyText : "请输入关键字",
								name: 'projectName',
								flex : 1,
								minWidth : 120
							},'-',{
								xtype : 'combo',
								fieldLabel : '审核状态',
								labelWidth : 30,
								labelSeparator: '',
								name: 'intentionAuditStatu',
								queryMode: 'local',
			   					width : 130,
			   					editable : false,
			   					displayField: 'name',
			  					valueField: 'id',
								store : Ext.create('Ext.data.Store',{
									fields : ['id','name'],
									data : [
										{'id':'0','name':'未审核'},
										{'id':'1','name':'已审核'},
										{'id':' ','name':'全部'}
									]
								})
							},'-',{
								xtype : 'combo',
								fieldLabel : '业务状态',
								labelWidth : 30,
								labelSeparator: '',
								name: 'intentionStatu',	//到分公司级别
								queryMode: 'local',
								editable : false,
			   					value: 0,
			   					width : 130,
			   					displayField: 'name',
			  					valueField: 'id',
								store : Ext.create('Ext.data.Store',{
									fields : ['id','name'],
									data : [
										{'id':'0','name':'未转移'},
										{'id':'1','name':'已转移'},
										{'id':'2','name':'已删除'},
										{'id':' ','name':'全部'}
									]
								})
							},{
								xtype : 'button',
								text : '查询',
								width : 70,
								iconCls : 'query',
								handler : "onQueryClick"
							},{
								xtype : 'button',
								text : '清空',
								width : 70,
								iconCls : 'reset',
								handler : "onClearClick"
							}]
				},
            	{
            		xtype : 'fieldset',
            		title: '更多查询（点击展开）',
					scrollable: 'y',
					collapsible : true,
					collapsed : true,
					items:[{
						
								xtype : 'toolbar',
								itemId : 'query2',
								enableOverflow : true,
								overflowHandler: 'scroller',
								dock : 'top',
								defaults : {
									labelWidth : 60,
									labelAlign : 'right',
									width : 200
								},
								items : ['-','-',{
									xtype : 'textfield',
									fieldLabel : '建设单位',
									emptyText : "请输入关键字",
									name: 'buildUnit',
									flex : 1,
									minWidth : 140
								},'-',{
									xtype : 'textfield',
									fieldLabel : '项目经理',
									emptyText : "请输入关键字",
									name: 'projectManager',
									flex : 1,
									minWidth : 140
								},'-',{
									xtype : 'numberfield',
									fieldLabel : '合同造价',
									name: 'contractPriceMin'
								},{
									xtype : 'label',
									text : '~',
									width : 10
								},{
									xtype : 'numberfield',
									name: 'contractPriceMax',
									width : 140
								},'-',{
									xtype : 'numberfield',
									fieldLabel : '建筑面积',
									name: 'constructionAreaMin'
								},{
									xtype : 'label',
									text : '~',
									width : 10
								},{
									xtype : 'numberfield',
									name: 'constructionAreaMax',
									width : 140
								}]
					
					},{
							xtype : 'toolbar',
								itemId : 'query3',
								enableOverflow : true,
								dock : 'top',
								defaults : {
									labelWidth : 60,
									labelAlign : 'right'
								},
								items : ['-','-',{
									xtype : 'tagfield',
									fieldLabel : '结构形式',
									flex : 1,
									name: 'constructStyle',	
									queryMode: 'local',
				   					displayField: 'name',
				  					valueField: 'id',
				  					filterPickList: true,
									store : me.constructStyleStore
								}]
						
					}]
            	},
                {
                    xtype: 'pagingtoolbar',
                    store: me.store,
                    dock: 'bottom',
                    displayInfo: true,
                    //为了多选模式 重写刷新按钮 将grid选择清空
                    doRefresh : function(btn){
                    	btn.up('grid').setSelection('');
				        var pagingtoolbaritem = btn.up('grid').down('pagingtoolbar'), //这里不能用#xxx 可能是itemId重复导致
			            store = pagingtoolbaritem.store,
			            current = store.currentPage;
				        if (pagingtoolbaritem.fireEvent('beforechange', pagingtoolbaritem, current) !== false) {
				            store.loadPage(current);
				            return true;
				        }
				        return false;
				    }
                },
                {
                    xtype: 'toolbar',
                    itemId:'query',
                    dock: 'top',
                    items: [
                    	{
                            iconCls: 'acutalmeasure_add',
							disabled:false,
                            itemId:'add',
                            text: '添加',
                            handler: "onAddClick"
                        },
                        {
                            itemId:'update',
							disabled:false,
							text : '修改',
							iconCls : 'update',
							handler :"onUpdateClick"
						},
                        {
                            itemId:'delete',
							disabled:false,
                            iconCls: 'delete',
                            text: '删除',
                            handler: "onDeleteClick"
                        },
                        {
                            iconCls: 'acutalmeasure_refresh',
                            text: '刷新',
                            handler: "onRefreshClick"
                        },
                        {
                        	itemId:'examine',
                        	icon: '../images/audit.png',
                        	text : '审核',
                        	handler : 'examine'
                        },
                        {
                        	itemId:'unexamine',
                        	icon: '../images/reverseAudit.png',
                        	text : '反审核',
                        	handler : 'unexamine'
                        }, 
                        {
                        	itemId:'recovery',
                        	icon: '../images/recovery.png',
                        	text : '误删恢复',
                        	hidden: true,
                        	handler : 'recovery'
                        },'->',
                        {
                            itemId:'exportExcel',
							disabled:false,
							hidden: false,
                            iconCls: 'excel',
                            text: '导出Excel',
                            handler: "exportExcel"
                        },
                        {
                            itemId:'importExcel',
							disabled:true,
							hidden: true,
                            iconCls: 'excel',
                            text: '导入Excel',
                            handler: "importExcel"
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }

});