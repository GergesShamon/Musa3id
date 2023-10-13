/* 
 * Musa3id: A gadget to assist various user actions on arabic wikipedia. a fork of Adiutor (Author: Vikipolimer).
 * Author: وهراني (Wahrani)
 * licensed under the Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0) and GNU Free Documentation License (GFDL). 
 * Module: Revision deletion requests
 */
/* <nowiki> */
$.when(mw.loader.using(["mediawiki.user", "oojs-ui-core", "oojs-ui-windows", ]), $.ready).then(function() {
	var mwConfig = mw.config.get(["wgAction", "wgPageName", "wgTitle", "wgUserGroups", "wgUserName", "wgCanonicalNamespace", "wgNamespaceNumber", "wgRevisionId"]);
	var api = new mw.Api();
	var RDRRationale, RequestRationale;

	function RevisionDeleteRequestDialog(config) {
		RevisionDeleteRequestDialog.super.call(this, config);
	}
	OO.inheritClass(RevisionDeleteRequestDialog, OO.ui.ProcessDialog);
	RevisionDeleteRequestDialog.static.name = 'RevisionDeleteRequestDialog';
	RevisionDeleteRequestDialog.static.title = 'Musa3id (Beta) - طلب إخفاء مراجعة';
	RevisionDeleteRequestDialog.static.actions = [{
		action: 'save',
		label: 'إنشاء ',
		flags: ['primary', 'progressive']
	}, {
		label: 'إلغاء',
		flags: 'safe'
	}];
	RevisionDeleteRequestDialog.prototype.initialize = function() {
		RevisionDeleteRequestDialog.super.prototype.initialize.apply(this, arguments);
		var headerTitle = new OO.ui.MessageWidget({
			type: 'notice',
			inline: true,
			label: new OO.ui.HtmlSnippet('<strong>طلب إخفاء مراجعة</strong><br><small>قبل تقديم طلب باستخدام هذه الأداة، يجب إعلام المستخدم بقواعد ويكيبيديا. في حالة حدوث تغييرات وتهديدات مسيئة، يمكن تقديم طلب دون الحاجة للإخطار.</small>')
		});
		RequestRationale = new OO.ui.FieldsetLayout({
			label: 'حيثيات الطلب'
		});
		RequestRationale.addItems([
			new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
				selected: false,
				data: 'إزالة المعلومات الشخصية غير العامة',
			}), {
				label: 'إزالة المعلومات الشخصية غير العامة',
				align: 'inline'
			}),
			new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
				selected: false,
				data: 'المحتوى شتائم وسب',
			}), {
				label: 'المحتوى شتائم وسب',
				align: 'inline'
			}),
			new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
				selected: false,
				data: 'إزالة معلومات يحتمل أن تكون تشهيرية',
			}), {
				label: 'إزالة معلومات يحتمل أن تكون تشهيرية',
				align: 'inline'
			}), new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
				selected: false,
				data: 'محتوى لا علاقة له بالمقالة، يهدف إلى إثارة المجتمع',
			}), {
				label: 'محتوى لا علاقة له بالمقالة، يهدف إلى إثارة المجتمع',
				align: 'inline'
			}), new OO.ui.FieldLayout(new OO.ui.CheckboxInputWidget({
				selected: false,
				data: "إزالة تعد على حق المؤلف" ,
			}), {
				label: "إزالة تعد على حق المؤلف" ,
				align: 'inline'
			}),
			rationaleField = new OO.ui.FieldLayout(rationaleInput = new OO.ui.MultilineTextInputWidget({
				placeholder: 'طلب إخفاء مراجعة',
				value: '',
			}), {
				label: 'مراجعة',
				align: 'inline',
			}),
		]);
		var revNum = mwConfig.wgRevisionId;
		revisionField = new OO.ui.FieldLayout(revisionNumber = new OO.ui.TextInputWidget({
				value: revNum
			}), {
				label: 'رقم (معرف) المراجعة',
				help: 'معرّف المراجعة التي يجب إخفاؤها'
			}),
			this.content = new OO.ui.PanelLayout({
				padded: true,
				expanded: false
			});
		this.content.$element.append(headerTitle.$element, '<br><hr><br>', RequestRationale.$element, '<br>', rationaleInput.$element, '<br>', revisionField.$element);
		this.$body.append(this.content.$element);
	};
	RevisionDeleteRequestDialog.prototype.getActionProcess = function(action) {
		var dialog = this;
		if(action) {
			return new OO.ui.Process(function() {
				RequestRationale.items.forEach(function(Rationale) {
					if(Rationale.fieldWidget.selected) {
						RDRRationale = Rationale.fieldWidget.data;
					}
				});
				createRequest(RDRRationale, revisionNumber, rationaleInput);
				dialog.close({
					action: action
				});
			});
		}
		return RevisionDeleteRequestDialog.super.prototype.getActionProcess.call(this, action);
	};
	var windowManager = new OO.ui.WindowManager();
	$(document.body).append(windowManager.$element);
	var dialog = new RevisionDeleteRequestDialog();
	windowManager.addWindows([dialog]);
	windowManager.openWindow(dialog);

	function createRequest(RDRRationale, revisionNumber, rationaleInput) {
		api.postWithToken('csrf', {
			action: 'edit',
			title: 'ويكيبيديا:إخطار الإداريين/إخفاء/الحالية',
			appendtext: "\n" + '{{نسخ:طلب إخفاء مراجعة|توقيع=~~~~'
						+"\n" + '|صفحة = ' + mwConfig.wgPageName.replace(/_/g, " ")
                        +"\n" + '|رقم النسخة = '+ revisionNumber.value
                        +"\n" + '|سبب = '+ RDRRationale + ' '  + rationaleInput.value
                        +"\n" + '}}'+"\n" ,
            summary: 'طلب إخفاء مراجعة في [['+ mwConfig.wgPageName.replace(/_/g, " ")+']]',
			//tags: 'Musa3id',
			format: 'json'
		}).done(function() {
            mw.notify('تم العملية بنجاح. انتظر قليلا.',{ autoHide: false});
			window.location = '/wiki/ويكيبيديا:إخطار الإداريين/إخفاء/الحالية';
		});
	}
});
/* </nowiki> */