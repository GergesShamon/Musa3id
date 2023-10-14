/* 
 * Musa3id: A gadget to assist various user actions on arabic wikipedia. a fork of Adiutor (Author: Vikipolimer).
 * Author: وهراني (Wahrani)
 * licensed under the Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0) and GNU Free Documentation License (GFDL).
 * Module: Administrator intervention against vandalism
 */
/* <nowiki> */
$.when(mw.loader.using(["mediawiki.user", "oojs-ui-core", "oojs-ui-windows", ]), $.ready).then(function() {
	var mwConfig = mw.config.get(["wgAction", "wgPageName", "wgTitle", "wgUserGroups", "wgUserName", "wgCanonicalNamespace", "wgNamespaceNumber"]);
	api = new mw.Api();
	var RDRRationale, VandalizedPageInput, revId;
	var VandalizedPage = {};
	var RequestRationale = false;
	VandalizedPage.value = null;
	var revisionID = {};
	revisionID.value = null;

	function RevisionDeleteRequestDialog(config) {
		RevisionDeleteRequestDialog.super.call(this, config);
	}
	OO.inheritClass(RevisionDeleteRequestDialog, OO.ui.ProcessDialog);
	RevisionDeleteRequestDialog.static.name = 'RevisionDeleteRequestDialog';
	RevisionDeleteRequestDialog.static.title = 'Musa3id (Beta) - الإبلاغ عن مستخدم';
	RevisionDeleteRequestDialog.static.actions = [{
		action: 'save',
		label: 'تنفيذ',
		flags: ['primary', 'progressive']
	}, {
		label: 'إلغاء',
		flags: 'safe'
	}];
	RevisionDeleteRequestDialog.prototype.initialize = function() {
		RevisionDeleteRequestDialog.super.prototype.initialize.apply(this, arguments);
		var RationaleSelector = new OO.ui.DropdownWidget({
			menu: {
				items: [
					new OO.ui.MenuOptionWidget({
						data: 1,
						label: 'تخريب'
					}),
					new OO.ui.MenuOptionWidget({
						data: 2,
						label: 'اسم مستخدم مخالف'
					}),
				]
			},
			label: "سبب المنع"
		});
		var headerTitle = new OO.ui.MessageWidget({
			type: 'notice',
			inline: true,
			label: new OO.ui.HtmlSnippet('<strong>طلب منع المستخدم</strong><br><small>تُستخدم هذه الأداة لطلبات منع المستخدمين الذين يضرون ويكيبيديا. قبل تقديم طلب عبر هذه الأداة، يجب إعلام المستخدم بقواعد ويكيبيديا وسياسة المنع.</small>')
		});
		this.content = new OO.ui.PanelLayout({
			padded: true,
			expanded: false
		});
		var RequestRationaleContainer = new OO.ui.FieldsetLayout({
			classes: ['Musa3id-report-window-rationale-window']
		});
		RationaleSelector.getMenu().on('choose', function(menuOption) {
			switch(menuOption.getData()) {
				case 1:
					RequestRationale = new OO.ui.FieldsetLayout({
						label: 'سبب الطلب'
					});
					RequestRationale.addItems([
						new OO.ui.FieldLayout(VandalizedPage = new OO.ui.TextInputWidget({
							value: ''
						}), {
							label: 'الصفحة ذات الصلة',
							help: 'اتركه فارغًا لتجنب الارتباط بأي صفحات في التقرير'
						}),
						new OO.ui.FieldLayout(revisionID = new OO.ui.TextInputWidget({
							value: ''
						}), {
							label: 'معرف المراجعة',
							help: 'اتركه فارغًا لتجنب إضافة معرف المراجعة'
						}),
						new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
							selected: false,
							data: 'التخريب على الرغم من التحذيرات المتعددة',
						}), {
							label: 'التخريب على الرغم من التحذيرات المتعددة',
							align: 'inline'
						}),
						new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
							selected: false,
							data: 'التخريب بعد انتهاء المنع (خلال يوم واحد)',
						}), {
							label: 'التخريب بعد انتهاء المنع (خلال يوم واحد)',
							align: 'inline'
						}),
						new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
							selected: false,
							data: 'الحساب لأغراض التخريب فقط',
						}), {
							label: 'الحساب لأغراض التخريب فقط',
							align: 'inline'
						}),
						new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
							selected: false,
							data: 'الحساب لأغراض إعلانية فقط',
						}), {
							label: 'الحساب لأغراض إعلانية فقط',
							align: 'inline'
						}),
					]);
					break;
				case 2:
					RequestRationale = new OO.ui.FieldsetLayout({
						label: 'سبب الطلب'
					});
					RequestRationale.addItems([
						new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
							selected: false,
							data: 'اسم مستخدم مربك ومضلل ومثير للمشاكل',
						}), {
							label: 'اسم مستخدم مربك ومضلل ومثير للمشاكل',
							align: 'inline'
						}),
						new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
							selected: false,
							data: 'اسم المستخدم ذو العلامة التجارية',
						}), {
							label: 'اسم المستخدم ذو العلامة التجارية',
							align: 'inline'
						}),
						new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
							selected: false,
							data: 'اسم شخص مشهور لا يزال على قيد الحياة أو توفي مؤخرا',
						}), {
							label: 'اسم شخص مشهور لا يزال على قيد الحياة أو توفي مؤخرا',
							align: 'inline'
						}),
						new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
							selected: false,
							data: 'اسم مستخدم مسيء أو تشهيري',
						}), {
							label: 'اسم مستخدم مسيء أو تشهيري',
							align: 'inline'
						}),
						new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
							selected: false,
							data: 'اسم مستخدم غير مرغوب فيه أو إعلاني',
						}), {
							label: 'اسم مستخدم غير مرغوب فيه أو إعلاني',
							align: 'inline'
						}),
					]);
					break;
			}
			RequestRationaleContainer.$element.html(RequestRationale.$element);
		});
		this.content.$element.append(headerTitle.$element, '<hr><br>', RationaleSelector.$element, '<br><br>', RequestRationaleContainer.$element);
		RevisionDeleteRequestDialog.prototype.getBodyHeight = function() {
			return Math.max(this.content.$element.outerHeight(false), 450);
		};
		this.$body.append(this.content.$element);
	};
	RevisionDeleteRequestDialog.prototype.getActionProcess = function(action) {
		var dialog = this;
		if(action) {
			if(RequestRationale) {
				RequestRationale.items.forEach(function(Rationale) {
					if(Rationale.fieldWidget.selected) {
						RDRRationale = Rationale.fieldWidget.data;
					}
				});
			}
			if(RDRRationale) {
				return new OO.ui.Process(function() {
					if(VandalizedPage.value) {
						VandalizedPageInput = '[[' + VandalizedPage.value + ']] علي الصفحة ';
					} else {
						VandalizedPageInput = '';
					}
					if(revisionID.value) {
						revId = '([[خاص:الفرق/' + revisionID.value + '|الفرق]]) ';
					} else {
						revId = '';
					}
					PreparedText = '{{نسخ:طلب منع مستخدم|مستخدم= ' + mwConfig.wgPageName.replace(/_/g, " ").replace('مستخدم:', '').replace('خاص:مساهمات/', '') + ' |سبب='.concat(VandalizedPageInput, revId, RDRRationale) + '}}';
					addReport(PreparedText);
					console.log(PreparedText);
					dialog.close({
						action: action
					});
				});
			} else {
				OO.ui.alert('الرجاء اختيار السبب').done(function() {});
			}
		}
		return RevisionDeleteRequestDialog.super.prototype.getActionProcess.call(this, action);
	};
	var windowManager = new OO.ui.WindowManager();
	$(document.body).append(windowManager.$element);
	var dialog = new RevisionDeleteRequestDialog();
	windowManager.addWindows([dialog]);
	windowManager.openWindow(dialog);

	function addReport(PreparedText) {
		api.postWithToken('csrf', {
			action: 'edit',
			title: 'ويكيبيديا:إخطار الإداريين/منع/الحالية',
			appendtext: "\n" + PreparedText + "\n",
			summary: 'طلب منع ال[[مستخدم:' + mwConfig.wgPageName.replace(/_/g, " ").replace('مستخدم:', '').replace('خاص:مساهمات/', '') + ']]',
			//tags: 'Musa3id',
			format: 'json'
		}).done(function() {
			window.location = '/wiki/ويكيبيديا:إخطار الإداريين/منع/الحالية';
		});
	}
});
/* </nowiki> */