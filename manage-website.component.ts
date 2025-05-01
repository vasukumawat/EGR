import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'app/shared/notification/notification';
import { ChartOptions, ChartData } from 'chart.js';
import { ChartType } from 'ng-apexcharts';
import { BaseChartDirective } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { ManageWebsiteService } from './manage-website.service';
import { MatDialog } from '@angular/material/dialog';
import { URLService } from 'app/modules/url-service/url.service';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import { CKEditorComponent } from 'ng2-ckeditor';
import { CdkDragDrop, CdkDragEnd, moveItemInArray ,CdkDragStart, CdkDragMove } from '@angular/cdk/drag-drop';
import { environment } from 'environments/environment';
import { ThemePalette } from '@angular/material/core';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import Font from '@ckeditor/ckeditor5-build-classic';
// import { Font } from 'ckeditor5';

@Component({
  selector: 'app-manage-website',
  templateUrl: './manage-website.component.html',
  styleUrls: ['./manage-website.component.scss']
})
export class ManageWebsiteComponent implements OnInit {
  isSmallScreen = false;
  hideSideWindow = false;
  hideAddSection = false
  @ViewChild('scrollContainerItem') scrollContainerItem!: ElementRef;
  @ViewChild(BaseChartDirective) baseChart!: BaseChartDirective;
  @ViewChild('vimeoPlayer', { static: false }) videoPlayer: ElementRef;
  clonedSection = null;
  slideContainer = [
    {
      "id": '00000000-0000-0000-0000-000000000000',
      "isVideo": false,
      "uniqueId": this.getNanoTimestampWithRandomString(),
      "url": "",
      "Content": "",
      "bannerHeading": "",
      "bannerSubHeading": "",
      "newHeadings": [
        {
          "text": "<p><span style=\"font-size:24px;\"><span style=\"color:#ffffff;\">​​​​​​​NEWS YOU CAN USE</span></span></p>\n",
          "x": 2.76100086281277,
          "y": 13.768115942028986
        },
        {
          "text": "<h2><span style=\"color:#ffffff;\">​​​​​​​Q1 2025 Program Overview</span></h2>\n",
          "x": 2.76100086281277,
          "y": 24.879227053140095
        },
        {
          "text": "<p><span style=\"color:#ffffff;\"><span style=\"font-size:24px;\">​​​​​​​Learn more about the Kohler Preferred Partners Program today!</span></span></p>\n",
          "x": 2.8472821397756687,
          "y": 43.47826086956522
        }
      ],
      "type": "image",
      "panelType": "panel",
      "fullBleed": "",
      "fitWidth": "",
      "opacity": ""
    }
  ]
  sliderFlag = null;
  localAsset = 'assets/images/kohler_logo.png';
  logoUrl = 'assets/images/kohler_logo.png';
  logoId = null;
  logoTitle = null;
  showLogoPopup = false;
  disableDrag = false;
  showChild = false;
  editChild = false;
  indexToPush = 0;
  draftItem = null;
  originalDate = null;
  dateForm: FormGroup;
  sharedUrl = null;
  LinkDate = null;
  publishLinkDate = null;
  shareLinkDate = null;
  LinkId = null;
  sectionObject = {
    isPie: false,
    isLine: false,
    isbar: false,
    academy: false,
    all: false,
    credit: false,
    redemption: false,
    article: true,
    messages: false,
    singlepanel: false,
    text: false,
    goalTracker: true,
    trainingMonth: false,
  }
  videoFiles = null;
  editHeaderFlag = false
  addSection = false;
  containerPopup = false;
  showMenu = false;
  showGroupforadmin = false;
  showGroupforadminsins = false;
  showGroup = false;
  homeText = 'Home';
  sectionContainer = [];
  trainingEmbededVideo = null;
  sectionsArray = [];
  previousLink = null;
  showLink = false;
  isChild = false;
  ckeConfig: CKEDITOR.config;
  @ViewChild("myckeditorTI1") ckeditorTI1: CKEditorComponent;
  @ViewChild("myckeditorTI2") ckeditorTI2: CKEditorComponent;
  navigationArray = [
    // {
    //   id: 0,
    //   menuName: 'Homepage',
    //   menuId: 'HM',
    //   selected: false,
    //   isEdit: false,
    //   isHide: false,
    //   isShare: false,
    //   isPublish: false,
    //   isDelete: false
    // },
    // {
    //   id: 1,
    //   menuName: 'Redeem',
    //   menuId: 'RD',
    //   selected: false,
    //   isEdit: false,
    //   isHide: false,
    //   isShare: false,
    //   isPublish: false,
    //   isDelete: false
    // },
    // {
    //   id: 2,
    //   menuName: 'Learn More',
    //   menuId: 'LM',
    //   selected: false,
    //   isEdit: false,
    //   isHide: false,
    //   isShare: false,
    //   isPublish: false,
    //   isDelete: false
    // },
    // {
    //   id: 3,
    //   menuName: 'Academy',
    //   menuId: 'AC',
    //   selected: false,
    //   isEdit: false,
    //   isHide: false,
    //   isShare: false,
    //   isPublish: false,
    //   isDelete: false
    // },
    // {
    //   id: 4,
    //   menuName: 'Program Rules',
    //   menuId: 'PR',
    //   selected: false,
    //   isEdit: false,
    //   isHide: false,
    //   isShare: false,
    //   isPublish: false,
    //   isDelete: false
    // },
    // {
    //   id: 5,
    //   menuName: 'Important Resources',
    //   menuId: 'IR',
    //   selected: false,
    //   isEdit: false,
    //   isHide: false,
    //   isShare: false,
    //   isPublish: false,
    //   isDelete: false
    // },
  ]
  // home component data
  ytdSales: number = 0; 
  pieChartOptions: ChartOptions = {
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          pointStyle: 'circle',
          boxWidth: 10,
          padding: 20,
          font: {
            size: 12,
            lineHeight: 1.5,
          },
        }
      }
    },
    maintainAspectRatio: false, 
  };
  
  private carouselSubscription: Subscription;

  totalCourse = 0;
  currentCarousel = 0;
  totalAttempted = 0;
  view = [700, 400]
  remainingPoints = 0;
  pointsCredited = 0;
  targetValue = '0';
  totalSales = 0;
  isSalesSelected = false;

  pieChartData = [
    {
        "name": "Dummy Data : 100% (100%)",
        "value": 100
    },
  ];
  showManagePage = false;
  pieChartType: ChartType = 'pie';
  colorScheme = {
    domain: ["#C94D6D", "#4174C9", "#876B8E", "#8DBCCC", "#8FAAC6", "#8C4D57", "#b89dc7", "#966577", "#95a3de", "#fb9ad4", "#99738a", "#ccbdaf", "#97c4a0", "#c9adc9", "#e3ccba", "#bfe0b8", "#b7d2f7", "#d0c7f2", "#b6f0bf", "#d6bfd6"]
  };

  lineChartOptions: ChartOptions = {
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          pointStyle: 'circle'
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value:number = context.raw as number;
            if (this.isSalesSelected ) {
              return `Sales: $${this.formatNumberWithCommas(value.toFixed(2))}`;
            } else if (!this.isSalesSelected) {
              return `Points: ${this.formatNumberWithCommas(value)}`;
            }
            return `${context.dataset.label}: ${value}`;
          }
        }
      }
    },
    responsive: true,
    maintainAspectRatio: true
  };

  monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dev'];
  lineChartDataset = [
    {
      "label": "Sales: $0.00",
      "data": [
        0
      ],
      "borderColor": "blue",
      "fill": false
    },
    {
      "label": "Points: 350",
      "data": [
        350
      ],
      "borderColor": "pink",
      "fill": false
    }
  ];
  lineChartData: ChartData<'line', number[], string | string[]> = {
    "labels": [
      "Feb"
    ],
    "datasets": [
      {
        "label": "Points: 350",
        "data": [
          350
        ],
        "borderColor": "pink",
        "fill": false
      }
    ]
  }
  lineChartType: ChartType = 'line';
  apiRequest = {
    itemCount:4,
    pageIndex: 1,
    pageLimit: 4,
    sortBy: "name",
    search: "",
    sortDirection: "desc",
    filter: []
  };
  currentDate = new Date();
  notiApiRequest = {
    itemCount:3,
    pageIndex: 1,
    pageLimit: 3,
    sortBy: "",
    search: "",
    sortDirection: "",
    filter: []
  }
  lineChartLoading = false;
  enableManagePage = false;
  sideNavArray = []
  sideNavSubItemArray = []
  pieChartLoading = false;
  pointsAndSummaryLoading = false;
  isCurriculumLoading = false;
  isTransactionLoading = false;
  userType = 'normaluser';
  isNotificationLoading = false;
  curriculumData = [];
  transactionData = []
  selectedManagePageId = null;
  notifications = {customRecordCount: 0, totalRecords: 0, results: []};
  data: any;
  userName = sessionStorage.getItem('name')
  siteForm: FormGroup;
  manageForm: FormGroup;
  manageNavForm: FormGroup;
  childNavForm: FormGroup;
  fileName = null;
  file = null;
  showMenuManagePage = false
  showChildMenuName = false;
  modalReference: any;
  deleteItem = null;
  deleteElement: any; 
  TemplatesArray = [];
  showTemplateswindow = false;
  mobileView = false;
  previousStateStogage = []
  currentStateIndex = 0;
  slideContainertoRemove = null;
  containerIndex = null;
  hideAddNavOption = false
  public date: moment.Moment;
  public disabled = false;
  public showSpinners = true;
  public showSeconds = false;
  public touchUi = false;
  public enableMeridian = false;
  public maxDate: moment.Moment;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public color: ThemePalette = 'primary';
  availableSpace: number = 100; 
  containerLayout: any[] = [];
  currentRow: number = 0; 
  
  
  constructor(private sanitizer: DomSanitizer,private urlService: URLService, private _matDialog: MatDialog, private router: Router, private _formbuilder: FormBuilder, private notificationService: NotificationService, private manageWebsiteService: ManageWebsiteService, private fb: FormBuilder) {
    let chartWidth = window.innerWidth > 1100 ? 244 : window.innerWidth <= 1100 && window.innerWidth > 700 ? window.innerWidth - 240 : window.innerWidth <= 700 && window.innerWidth > 400 ? window.innerWidth - 150 : window.innerWidth - 80;
    this.view = [chartWidth, 300];
    this.siteForm = this._formbuilder.group({
      site: null,
    })
    this.manageForm = this._formbuilder.group({
      name: [null, Validators.required],
    })
    this.manageNavForm = this._formbuilder.group({
      name: [null, Validators.required],
      menuType : [null, Validators.required],
      url: [null, Validators.required],
    })
    this.childNavForm = this._formbuilder.group({
      name: [null, Validators.required],
      menuType : ['basic'],
      itemId: [null],
      url: [null, Validators.required],
    })
    this.initialiseDateForm()
    this.fetchNavigationArray()
    // this.fetchCMSMenu()
    // this.getLogoHeader()
    this.checkScreenSize();
  }
  @HostListener('window:resize', [])
  onResizeWindow() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isSmallScreen = window.innerWidth < 1290;
  }
  initialiseDateForm() {
    this.dateForm = this.fb.group({
      startDate: [new Date()]
    });
    this.formatSelectedDate(new Date());
  }
  ngOnInit() {
    this.ckeConfig = {
      allowedContent: true,
      height: '150px',
      extraPlugins: 'divarea',
      resize_enabled: false,
      removePlugins: 'elementspath,exportpdf,autogrow',
      forcePasteAsPlainText: true,
      font_names: 'Arial;Times New Roman;Verdana',
      // fontSize_sizes: '14px;16px;18px;20px;24px;28px;32px;36px;',
      font_defaultLabel: 'Arial',
      fontSize_defaultLabel: '28',
      
      colorButton_colors: '02479c,FF0000,00FF00,0000FF,F1C40F,8E44AD,2ECC71,D35400',  
      colorButton_enableAutomatic: false,
      
      contentsCss: [
        // 'body { font-size: 28px; font-family: Arial; line-height: 40px; margin: 0; background: #f5f5f5; }',
        'p { margin: 0; padding: 0; background: #f5f5f5; }',
        '.cke_editable { padding: 8px 12px; background: #f5f5f5; }',
        '.cke_editable p { background: #f5f5f5 !important; }',
        '.cke_wysiwyg_div { background: #f5f5f5 !important; }',
        // Add styles for better text visibility
        '.cke_editable[style*="color: white"], .cke_editable[style*="color: #ffffff"] { background: #333333 !important; }',
        'p[style*="color: white"], p[style*="color: #ffffff"] { background: #333333 !important; }'
      ],
      format_tags: 'p;h1;h2;h3;pre',

      toolbarGroups: [
        { name: 'document', groups: ['mode', 'document', 'doctools'] },
        { name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing'] },
        { name: 'forms', groups: ['forms'] },
        '/',
        { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
        { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph'] },
        { name: 'links', groups: ['links'] },
        { name: 'insert', groups: ['insert'] },
        '/',
        { name: 'styles', groups: ['styles'] },
        { name: 'colors', groups: ['colors'] },
        { name: 'tools', groups: ['tools'] },
        { name: 'others', groups: ['others'] },
        { name: 'about', groups: ['about'] },
        { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align'] },
      ],
      
      removeButtons: 'Source,Save,NewPage,Preview,Print,Templates,Cut,Copy,Paste,PasteText,PasteFromWord,Find,Replace,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Strike,Subscript,Superscript,CopyFormatting,RemoveFormat,Outdent,Indent,CreateDiv,Blockquote,BidiLtr,BidiRtl,Language,Unlink,Anchor,Image,Flash,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Maximize,ShowBlocks,About',
      
      on: {
        instanceReady: function(evt) {
          const editor = evt.editor;
          editor.resize('100%', '300px');
        },
        key: function(evt) {
          if (evt.data.keyCode === 13) {
            const editor = evt.editor;
            const currentHeight = parseInt(editor.container.getStyle('height'));
            const newHeight = Math.min(currentHeight + 40, 400);
            editor.resize('100%', newHeight);
          }
        }
      }
    };
  }
  getNanoTimestampWithRandomString(): string {
    const nowMs = Date.now(); 
    const extraNs = Math.floor(performance.now() * 1e6) % 1e6;  
    const randomString = Math.random().toString(36).substring(2, 10);
    return `${BigInt(nowMs) * BigInt(1e6) + BigInt(extraNs)}-${randomString}`;
  }
  // {
  //   allowedContent: false,
  //   forcePasteAsPlainText: true,
  //   font_names: 'Arial;Times New Roman;Verdana',
  //   toolbarGroups: [
  //     { name: 'document', groups: ['mode', 'document', 'doctools'] },
  //     { name: 'clipboard', groups: ['clipboard', 'undo'] },
  //     { name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing'] },
  //     { name: 'forms', groups: ['forms'] },
  //     '/',
  //     { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
  //     { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph'] },
  //     { name: 'links', groups: ['links'] },
  //     { name: 'insert', groups: ['insert'] },
  //     '/',
  //     { name: 'styles', groups: ['styles'] },
  //     { name: 'colors', groups: ['colors'] },
  //     { name: 'tools', groups: ['tools'] },
  //     { name: 'others', groups: ['others'] },
  //     { name: 'about', groups: ['about'] }
  //   ],
  //   removeButtons: 'Source,Save,NewPage,Preview,Print,Templates,Cut,Copy,Paste,PasteText,PasteFromWord,Undo,Redo,Find,Replace,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Strike,Subscript,Superscript,CopyFormatting,RemoveFormat,Outdent,Indent,CreateDiv,Blockquote,BidiLtr,BidiRtl,Language,Unlink,Anchor,Image,Flash,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Maximize,ShowBlocks,About'
  // };
  dropContainers(event: CdkDragDrop<any[]>) {
    const item = this.sectionsArray[event.previousIndex];
    const container = event.container.element.nativeElement;
    
    const dropX = event.dropPoint?.x; // Correct X position
    const dropY = event.dropPoint?.y; // Correct Y position
  
    if (dropX === undefined || dropY === undefined) {
      return; // Prevent errors if pointer position is unavailable
    }
  
    let closestIndex = 0;
    let minDistance = Infinity;
  
    // Get only element children, ignoring text nodes
    const children = Array.from(container.children) as HTMLElement[];
  
    children.forEach((child, index) => {
      const rect = child.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2; // Center of element
      const centerY = rect.top + rect.height / 2;
  
      const distance = Math.sqrt(Math.pow(dropX - centerX, 2) + Math.pow(dropY - centerY, 2));
  
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });
  
    // Ensure smooth left-to-right and right-to-left movement
    if (event.previousIndex !== closestIndex) {
      moveItemInArray(this.sectionsArray, event.previousIndex, closestIndex);
    }
  }
  


  trackByFn(index: number, item: any): number {
    return item.id || index;
  }

  onDragStarted(event: CdkDragStart) {
    const preview = document.querySelector('.cdk-drag-preview') as HTMLElement;
    if (preview) {
        preview.style.width = '100px';
        preview.style.height = '100px';
    }
}

onDragStart(event: CdkDragStart, textItem: any) {
  const textElement = event.source.element.nativeElement;

  textElement.style.transform = 'none';
  textElement.classList.add('custom-no-transform');
}

onDragMove(event: CdkDragMove, textItem: any) {
  let clientX: number, clientY: number;

  if (event.event instanceof MouseEvent) {
    clientX = event.event.clientX;
    clientY = event.event.clientY;
  } else if (event.event instanceof TouchEvent && event.event.touches.length > 0) {
    clientX = event.event.touches[0].clientX;
    clientY = event.event.touches[0].clientY;
  } else {
    return;
  }

  const parentElement = event.source.getRootElement().offsetParent as HTMLElement;
  const parentRect = parentElement.getBoundingClientRect();

  textItem.x = ((clientX - parentRect.left) / parentRect.width) * 100;
  textItem.y = ((clientY - parentRect.top) / parentRect.height) * 100;
}
onDragEnd(event: CdkDragEnd, textItem: any) {
  const { x, y } = event.source.getFreeDragPosition();
  const imgElement = document.getElementById('imageRef') as HTMLImageElement;
  const imageRect = imgElement.getBoundingClientRect();
  
  const textElement = event.source.element.nativeElement;
  const textRect = textElement.getBoundingClientRect();
  
  textItem.x = Math.max(0, Math.min((x / imageRect.width) * 100, 100));
  textItem.y = Math.max(0, Math.min((y / imageRect.height) * 100, 100));
  textElement.style.transform = 'none';
  // textElement.style.position = 'absolute';

  this.preventOverlap(textItem, textRect, false, null);
}
  
  closeManagePopupForm(event) {
    event.stopPropagation(); 
    this.showManagePage = false;
    this.showMenuManagePage = false;
  }
  switchDraftIndex = 0
  confirmDraftExit(i) {
    this.navigationArray.forEach((items, index) => {
      if(i === index) {
        items['selected'] = true;
        this.showChild = false;
        this.fetchCMSMenu();
        this.getLogoHeader();
        this.selectedManagePageId = items.id;
        this.manageWebsiteService.GetKeyValidation(this.selectedManagePageId, 'publish').subscribe((validationResp) => {
          if((validationResp?.id && validationResp?.key && validationResp?.validDateTime) && !validationResp?.expire) {
            const utcDate = new Date(validationResp?.validDateTime + 'Z');
            const estDate = new Intl.DateTimeFormat('en-US', {
              timeZone: 'America/New_York',
              month: '2-digit', day: '2-digit', year: 'numeric',
              hour: '2-digit', minute: '2-digit', hour12: false
            }).format(utcDate);
            this.publishLinkDate = estDate.replace(',', '');
          } else {
            this.publishLinkDate = null;
          }
        })
        this.getPublishedContainers();
      } else {
        items['selected'] = false;
      }
    })
    this.editChild = false;
  }
  selectPage(item, i, popup) {
    if(this.editChild) {
      this.switchDraftIndex = i;
      this.modalReference = this._matDialog.open(popup);
    } else {
      this.confirmDraftExit(i);
    }
  }
  confirmExitEditing() {
    this.editChild = false;
    this.getContainers();
    this.getLogoHeader();
    this.fetchCMSMenu()
    this.closeModel();
  }
  navigateToHome() {
    this.router.navigate(['/incentive-admin-home'])
  }
  selectChild() {
    this.showChild = true;
    this.navigationArray.forEach((items, index) => {
      items['selected'] = false;
    })
    const homePage = this.navigationArray.filter(x => x.menuId === 'HM')
    this.selectedManagePageId = homePage[0].id;
    this.manageWebsiteService.GetKeyValidation(this.selectedManagePageId, 'draft').subscribe((validationResp) => {
      if((validationResp?.id && validationResp?.key && validationResp?.validDateTime) && !validationResp?.expire) {
        const utcDate = new Date(validationResp?.validDateTime + 'Z');
        const estDate = new Intl.DateTimeFormat('en-US', {
          timeZone: 'America/New_York',
          month: '2-digit', day: '2-digit', year: 'numeric',
          hour: '2-digit', minute: '2-digit', hour12: false
        }).format(utcDate);
        this.shareLinkDate = estDate.replace(',', '');
      } else {
        this.shareLinkDate = null;
      }
    })
    this.getContainers();
    this.getLogoHeader();
    this.fetchCMSMenu()
  }
  deleteSlidePermanently(i, item) {
    this.manageWebsiteService.DeleteCMSContainerFile(item.getAllCMSItemViews[item['selectedIndex']].id,item.id, {}).subscribe((resp) => {
      this.notificationService.successTopRight('Slide deleted successfully.')
      item.getAllCMSItemViews.splice(item['selectedIndex'], 1);
      if(item.getAllCMSItemViews.length === 0) {
        this.sectionsArray.splice(i, 1);
        // this.sectionObject = {
        //   isPie: false,
        //   isLine: false,
        //   isbar: false,
        //   academy: false,
        //   all: false,
        //   credit: false,
        //   redemption: false,
        //   article: true,
        //   messages: false,
        //   singlepanel: false,
        //   text: false,
        //   goalTracker: true,
        //   trainingMonth: false,
        // }
        // this.sectionsArray.forEach((item) => {
        //   this.checkSelection(item.type)
        // })
      }
      for (let sections of this.previousStateStogage) {
        for (let panelItem of sections) {
          if (panelItem.type === 'panel') {
            panelItem.getAllCMSItemViews = panelItem.getAllCMSItemViews.filter(
              (imageItem) => imageItem.id !== item.getAllCMSItemViews[item['selectedIndex']].id
            );
          }
        }
      }
      this.closeModel()
    })
  }
  removeContainer(container: any) {
    const index = this.sectionContainer.indexOf(container);
    if (index >= 0) {
      const width = this.getWidthPercentage(container.className);
      this.sectionContainer.splice(index, 1);
      this.availableSpace += width;
      this.recalculateLayout();
    }
  }
  onDateTimeChange(event: any): void {
    this.formatSelectedDate(event.target.value);
  }
    
  formatSelectedDate(value: Date) {
    if (!value) return;
  
    const date = new Date(value);
    const formattedDate = date.toISOString(); // Converts to "YYYY-MM-DDTHH:mm:ss.SSSZ"
  
    this.dateForm.controls['startDate'].setValue(formattedDate);
    this.originalDate = formattedDate;
  }
  
  
  padZero(num: number, size: number = 2): string {
    let s = num.toString();
    while (s.length < size) s = '0' + s;
    return s;
  }
  changeSubLink(items, i) {
    this.sideNavSubItemArray.forEach((item, index) => {
      if(index === i) {
        item['showLink'] = true;
        this.showLink = true
        this.previousLink = item.routerLink;
      } else {
        item['showLink'] = false;
      }
    })
    this.isChild = true;
    this.sideNavArray.forEach((item) => {
      item['showLink'] = false;
    })
  }
  changeLink(items, i) {
    this.sideNavArray.forEach((item, index) => {
      if(index === i) {
        item['showLink'] = true;
        this.showLink = true
        this.previousLink = item.routerLink;
      } else {
        item['showLink'] = false;
      }
    })
    this.isChild = false;
    this.sideNavSubItemArray.forEach((item) => {
      item['showLink'] = false;
    })
  }
  checkSlideValidation() {
    if (this.sectionContainer[0]['isVideo']) {
      return !!(this.slideContainer[0].Content || this.slideContainer[0].url);
    } else {
      return this.slideContainer.every(item => item.url);
    }
  }
  checkBannerSlideValidation(item) {
    if (item['isVideo']) {
      return !!(this.slideContainer[0].Content || this.slideContainer[0].url);
    } else {
      return this.slideContainer.every(item => item.url);
    }
  }
  openSlideTemplateDialog(item: any, content: any) {
    this.sliderFlag = item; // Store item for deletion
    if((this.slideContainer.length === 1 && this.slideContainer[0].url) || this.slideContainer.length > 1 || (this.slideContainer.length === 1 && this.slideContainer[0].Content)) {
      this.modalReference = this._matDialog.open(content);
    } else {
      this.selectslideType(this.sliderFlag);
    }
  }
  selectslideType(flag) {
    // const id = this.slideContainer.id
    this.sectionContainer[0]['isVideo'] = flag;
    if(flag) {
      this.slideContainer = [{
        "id": '00000000-0000-0000-0000-000000000000',
        "isVideo": flag,
        "uniqueId": this.getNanoTimestampWithRandomString(),
        "url": "",
        "Content": "",
        "bannerHeading": "",
        "bannerSubHeading": "",
        "newHeadings": [],
        "type": flag ? "Video" : "image",
        "panelType": "panel",
        "fullBleed": "",
        "fitWidth": "",
        "opacity": ""
      }]
    } else {
      this.slideContainer = [{
        "id": '00000000-0000-0000-0000-000000000000',
        "isVideo": flag,
        "uniqueId": this.getNanoTimestampWithRandomString(),
        "url": "",
        "Content": "",
        "bannerHeading": "",
        "bannerSubHeading": "",
        "newHeadings": [],
        "type": flag ? "Video" : "image",
        "panelType": "panel",
        "fullBleed": "",
        "fitWidth": "",
        "opacity": ""
      }]
    }
  }
  
  cancelLinkChange(items) {
    this.showLink = false
    items['showLink'] = !items['showLink']
    items.routerLink = this.previousLink;
  }
  saveLinkChange() {
    if(this.isChild) {
      this.sideNavSubItemArray.forEach((item) => {
        if(item['showLink']) {
          this.showLink = false
          item.routerLink = this.previousLink;
        }
        item['showLink'] = false;
      })
    } else {
      this.sideNavArray.forEach((item) => {
        if(item['showLink']) {
          this.showLink = false
          item.routerLink = this.previousLink;
        }
        item['showLink'] = false;
      })
    }
  }

  saveContainerContent(content, menuId, type): Promise<void> {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('Id', content.id || '00000000-0000-0000-0000-000000000000');
      formData.append('MenuId', menuId);
      formData.append('Content', content.Content ? content.Content : '');
      formData.append('Type', content.isVideo ? 'video' : 'image');
      formData.append('PanelType', type);
      formData.append('Status', 'draft');
      formData.append('ContainerId', content.containerId);
      formData.append('UniqueId', content.uniqueId);
      formData.append('BannerHeading', content.bannerHeading);
      formData.append('BannerSubHeading', content.bannerSubHeading);
      formData.append('newHeadings', JSON.stringify(content.newHeadings));
      formData.append('FullBleed', '');
      formData.append('FitWidth', '');
      formData.append('Opacity', '');
      formData.append('file', !content.isVideo ? content.ImageFile : content.videoFile ? content.videoFile : '');
  
      this.manageWebsiteService.UploadCMSContainerFile(formData).subscribe({
        next: (resp) => {
          if (resp.isSuccess) {
            console.log('Saved Successfully');
            resolve();
          } else {
            console.warn('Failed to save');
            reject('UploadCMSContainerFile failed');
          }
        },
        error: (err) => reject(err)
      });
    });
  }
  saveTemplateContent(content): Promise<void> {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('Id', '00000000-0000-0000-0000-000000000000');
      formData.append('BannerHeading', content.bannerHeading);
      formData.append('BannerSubHeading', content.bannerSubHeading);
      formData.append('UniqueId', content.uniqueId);
      formData.append('newHeadings', JSON.stringify(content.newHeadings));
      formData.append('file', content.ImageFile);
      if(content.id === '00000000-0000-0000-0000-000000000000' || !content.id) {
        this.manageWebsiteService.UploadCMSTempalteFile(formData).subscribe({
          next: (resp) => {
            if (resp.isSuccess) {
              console.log('Saved Successfully');
              resolve();
            } else {
              console.warn('Failed to save');
              reject('UploadCMSContainerFile failed');
            }
          },
          error: (err) => reject(err)
        });
      } else {
        const reqObj = {
          "id": content.id,
          "bannerHeading": content.bannerHeading,
          "newHeadings": content.newHeadings,
          "bannerSubHeading": content.bannerSubHeading,
          "tenantCode": environment.tentantcode
        }
        this.manageWebsiteService.LikeCMSTempalteFile(reqObj).subscribe({
          next: (resp) => {
            if (resp.isSuccess) {
              console.log('Saved Successfully');
              resolve();
            } else {
              console.warn('Failed to save');
              reject('LikeCMSTempalteFile failed');
            }
          },
          error: (err) => reject(err)
        });
      }
    });
  }

  async saveContainer() {
    if(this.sectionsArray.length && this.sectionsArray.length > 0) {
      let req = this.sectionsArray.map((items, index) => ({
        "type": items.type,
        "position": index,
        "containerId": items.containerId,
        "id": items.id,
        "isVideo": items.isVideo,
        "className": items.className,
        "text": items.text,
        "chartHeading": items.chartHeading,
        "salesHeading": items.salesHeading,
        "cmsItemViews": items.getAllCMSItemViews.map((item) => ({
          "templateId": items.type === 'template image' && item.templateId ? item.templateId : items.type === 'template image' && item.uploadId ? item.uploadId : '00000000-0000-0000-0000-000000000000',
          "isVideo": item.isVideo,
          "uniqueId": item.uniqueId,
          "bannerHeading": item.bannerHeading,
          "newHeadings": item.newHeadings,
          "bannerSubHeading": item.bannerSubHeading,
        })),
      }));
    
      try {
        await new Promise<void>((resolve, reject) => {
          this.manageWebsiteService.BulkSaveOrUpdateCMSContainer(req, this.selectedManagePageId).subscribe({
            next: (resp) => {
              if (resp.isSuccess) {
                this.notificationService.successTopRight('Progress Saved Successfully.');
                resolve();
              } else {
                reject('Bulk save failed');
              }
            },
            error: (err) => reject(err)
          });
        });
    
        for (let panelItem of this.sectionsArray) {
          if (panelItem.type === 'panel') {
            for (const item of panelItem.getAllCMSItemViews) {
              item['containerId'] = panelItem.containerId;      
              await this.saveContainerContent(item, this.selectedManagePageId, 'panel');
              if (item['addToTemplate']) {
                await this.saveTemplateContent(item);
              }
            }
          }
        }
        
    
        if(this.showChild) {
          this.getContainers();
        } else {
          this.getPublishedContainers();
        }
        this.editChild = false;
      } catch (error) {
        console.error("Error occurred:", error);
      }
    } else {
      this.notificationService.errorTopRight('The draft page cannot be empty. Hence, it cannot be saved.')
    }
  }

  GetAllCMTempalteFile() {
    this.manageWebsiteService.GetAllCMTempalteFile().subscribe((resp) => {
      if(resp.length && resp.length > 0) {
        this.TemplatesArray = resp;
        this.showTemplateswindow = true;
      } else {
        this.TemplatesArray = [];
        this.notificationService.errorTopRight('No templates found.')
      }
    })
  }
  openDeletetemplateDialog(item: any, content: any) {
    this.deleteItem = item; // Store item for deletion
    this.modalReference = this._matDialog.open(content);
  }
  
  confirmDeleteCMSTempalteFile() {
    this.manageWebsiteService.DeleteCMSTempalteFile(this.deleteItem.id).subscribe((resp) => {
      if (resp.isSuccess) {
        this.notificationService.successTopRight('Template deleted successfully.');
        this.GetAllCMTempalteFile();
      }
      this.modalReference.close(); // Close the dialog
    });
  }  
  openTemplatePopup() {
    this.GetAllCMTempalteFile()
  }
  useTemplate(item) {
    this.sectionsArray.unshift({
      "type": 'template image',
      "className": 'wfull',
      "text": '',
      "chartHeading": '',
      "salesHeading": '',
      "containerId": this.getNanoTimestampWithRandomString(),
      "getAllCMSItemViews": [{
        "templateId": item.id,
        "url": item.url,
        "bannerHeading": item.bannerHeading,
        "uniqueId": this.getNanoTimestampWithRandomString(),
        "newHeadings": item?.newHeadings ? item.newHeadings : [],
        "bannerSubHeading": item.bannerSubHeading,
      }],
    })
    this.showTemplateswindow = false;
    this.addSection = false;
    this.storeState();
  }
  
  changeEditHeader() {
    if(this.editHeaderFlag) {
      this.bulkSave();
    } else {
      this.sideNavArray.forEach((item) => {
        item['isEdit'] = false;
      })
      this.editHeaderFlag = true;
    }
  }
  openPublishDraftSchedule(item, i, content) {
    this.draftItem = item;
    this.modalReference = this._matDialog.open(content);
  }
  openDraftSchedule(content) {
    this.modalReference = this._matDialog.open(content);
  }
  scheduleJob() {
    if (this.dateForm.value.startDate) {
      this.manageWebsiteService.GetAllCMSMenu(true).subscribe((containerResp) => {
        this.manageWebsiteService.GetAllCMSHeader(false).subscribe((headerResp) => {
          this.manageWebsiteService.GetAllCMSContainer(this.selectedManagePageId, false).subscribe((resp) => {
            const reqObj = {
              "scheduleDateTime": this.dateForm.value.startDate,
              "cmsHeaderview": headerResp[0],
              "lmsSlideGroupView": containerResp,
              "cmsContainerView": resp
              .filter((items) => !(items.type === 'panel' && (!items.getAllCMSItemViews || items.getAllCMSItemViews.length === 0)))
              .map((items) => ({
                "type": items.type,
                "className": items.className,
                "containerId": items.containerId,
                "id": items.id,
                "isVideo": items.isVideo,
                "text": items.text,
                "chartHeading": items.chartHeading,
                "salesHeading": items.salesHeading,
                "cmsItemViews": items.getAllCMSItemViews && items.getAllCMSItemViews.length > 0
                  ? items.getAllCMSItemViews.map((item) => ({
                      "templateId": items.type? item.id : null,
                      "isVideo": item.isVideo,
                      "bannerHeading": item.bannerHeading,
                      "newHeadings": item.newHeadings,
                      "uniqueId": item.uniqueId,
                      "bannerSubHeading": item.bannerSubHeading,
                    })) 
                  : items.getAllCMSItemViews,
              }))
            }
            this.manageWebsiteService.ScheduleJob(this.draftItem.id, reqObj).subscribe((resp) => {
              if(resp.isSuccess) {
                this.notificationService.successTopRight('Draft scheduled successfully.')
                this.fetchNavigationArray()
                this.modalReference.close();
                this.initialiseDateForm();
              } else {
                this.notificationService.errorTopRight('Something went wrong.');
              }
            })
          })
        })
      })
    } else {
      this.notificationService.errorTopRight('Please select a date to schedule the draft.')
      this.dateForm.markAllAsTouched();
    }
  }
  createHomePageDraftPopup(content) {
    this.modalReference = this._matDialog.open(content);
  }
  deleteDraftItem = null;
  createdeleteDraftPopup(item, content) {
    this.deleteDraftItem = item;
    this.modalReference = this._matDialog.open(content);
  }
  async deleteDraftMenuItem() {
    if (!this.deleteDraftItem) return;
    if(this.deleteDraftItem.subMenuId) {
      const itemIndex = this.sideNavSubItemArray.findIndex((item) => item.id === this.deleteDraftItem.id);
      if (itemIndex !== -1) {
        this.sideNavSubItemArray.splice(itemIndex, 1);
      }
    } else {
      const itemIndex = this.sideNavArray.findIndex((item) => item.id === this.deleteDraftItem.id);
      if (itemIndex !== -1) {
        this.sideNavArray.splice(itemIndex, 1);
      }
    }
    try {
      const resp = await this.manageWebsiteService.DeleteCMSMenu({}, this.deleteDraftItem.id).toPromise();
  
      if (resp.isSuccess) {
        this.notificationService.successTopRight('Page Deleted Successfully.');
        this.hideAddNavOption = false;
        if(this.deleteDraftItem.menuId === 'collapsable') {
          for (const subItem of this.sideNavSubItemArray) {
            if (this.deleteDraftItem.id === subItem.subMenuId && subItem.menuId !== 'KRC' && subItem.menuId !== 'KRGC') {
              try {
                const subResp = await this.manageWebsiteService.DeleteCMSMenu({}, subItem.id).toPromise();
    
                if (subResp.isSuccess) {
                  this.sideNavSubItemArray = this.sideNavSubItemArray.filter(item => item.id !== subItem.id);
                }
              } catch (error) {
                console.log('Error deleting sub-menu item.');
              }
            }
          }

        }
  
  
        this.modalReference.close();
      } else {
        this.notificationService.errorTopRight('Something went wrong.');
      }
    } catch (error) {
      this.notificationService.errorTopRight('Error deleting page.');
    }
  }
  
  createHomePageDraft() {
    this.manageWebsiteService.CloneCMSMenu(false).subscribe((cloneResp) => {
      if(cloneResp.isSuccess) {
        this.manageWebsiteService.RecallPublishDataInDraft({},this.selectedManagePageId).subscribe((resp) => {
          const reqObj = [];
          this.navigationArray.forEach((nav) => {
            if (nav.menuId === 'HM') {
              nav.draftDeleted = false;
            }
            reqObj.push({ ...nav });
          });
          this.manageWebsiteService.BulkSaveOrUpdateCMSMenu(reqObj, false).subscribe((resp) => {
            if (resp.isSuccess) {
              this.fetchNavigationArray();
              this.notificationService.successTopRight('Draft Created Successfully');
              this.modalReference.close();
            } else {
              this.notificationService.errorTopRight('Something went wrong.');
            }
          })
        })
      }
    })
  }
  deletePageDraft() {
    const req = {
      menuId: this.draftItem.id
    }
    this.manageWebsiteService.DraftDelete(req).subscribe((resp) => {
      if(resp.isSuccess) {
        const reqObj = [];
        this.navigationArray.forEach((nav) => {
          if (nav.id === this.draftItem.id) {
            nav.draftDeleted = true;
          }
          reqObj.push({ ...nav });
        });
        this.manageWebsiteService.BulkSaveOrUpdateCMSMenu(reqObj, false).subscribe((resp) => {
          if (resp.isSuccess) {
            this.showChild = false;
            this.selectedManagePageId = null;
            this.fetchNavigationArray();
            this.getLogoHeader();
            this.notificationService.successTopRight('Draft deleted Successfully');
          } else {
            this.notificationService.errorTopRight('Something went wrong.');
          }
        })
      } else {
        this.manageWebsiteService.GetAllCMSContainer(this.draftItem.id, false).subscribe((resp) => {
          if(!resp || resp.length === 0) {
            const reqObj = [];
            this.navigationArray.forEach((nav) => {
              if (nav.id === this.draftItem.id) {
                nav.draftDeleted = true;
              }
              reqObj.push({ ...nav });
            });
            this.manageWebsiteService.BulkSaveOrUpdateCMSMenu(reqObj, false).subscribe((resp) => {
              if (resp.isSuccess) {
                this.showChild = false;
                this.selectedManagePageId = null;
                this.fetchNavigationArray();
                this.getLogoHeader();
                this.notificationService.successTopRight('Draft deleted Successfully');
              } else {
                this.notificationService.errorTopRight('Something went wrong.');
              }
            })
          }
        })
      }
    })

  }
  cancelSchedule(item) {
    this.manageWebsiteService.CancelledScheduleJob({
      "menuId": item.id,
      "currentJobId": item.scheduledId
    }).subscribe((resp) => {
      if(resp.isSuccess) {
        this.notificationService.successTopRight('Scheduled cancelled successfully.')
        this.showChild = false;
        this.selectedManagePageId = null;
        this.fetchNavigationArray();
      } else {
        this.notificationService.errorTopRight('Something went wrong.')
      }
    })
  }
  publishPage(item) {
    const publishedPageId = item.id;
    this.manageWebsiteService.GetAllCMSContainer(publishedPageId, false).subscribe((containerResp) => {
      const publishedPageContainer = containerResp.map((items) => ({
        "type": items.type,
        "className": items.className,
        "text": items.text,
        "containerId": items.containerId,
        "id": items.id,
        "isVideo": items.isVideo,
        "chartHeading": items.chartHeading,
        "salesHeading": items.salesHeading,
        "cmsItemViews": items.getAllCMSItemViews.map((item) => ({
          "isVideo": item.isVideo,
          "bannerHeading": item.bannerHeading,
          "uniqueId": item.uniqueId,
          "newHeadings": item.newHeadings,
          "bannerSubHeading": item.bannerSubHeading,
        })),
      }));
      if(publishedPageContainer && publishedPageContainer.length > 0) {
        this.manageWebsiteService.BulkSaveOrUpdateCMSPublishContainer(publishedPageId, publishedPageContainer).subscribe((publishResp) => {
          if(publishResp.isSuccess){
            const req = {
              menuId: publishedPageId
            }
            this.manageWebsiteService.CloneCMSMenu(true).subscribe((cloneResp) => {
              if(cloneResp.isSuccess) {
                this.manageWebsiteService.DraftDelete(req).subscribe((resp) => {
                  if(resp.isSuccess) {
                  }
                })
                this.notificationService.successTopRight(`${item.menuName} Published Successfully.`);
                this.showChild = false
                this.fetchCMSMenu();
                this.getLogoHeader();
                this.fetchNavigationArray();
                this.modalReference.close();
              } else {
                this.notificationService.errorTopRight('Something went wrong.')
              }
            });
            // this.notificationService.successTopRight(`${item.menuName} Published Successfully.`);
            // this.navigationArray.forEach((nav) => {
            //   if (nav.id === this.draftItem.id) {
            //     nav.draftDeleted = true;
            //   }
            //   reqObj.push({ ...nav });
            // });
            // const reqObj = [];
            // this.manageWebsiteService.BulkSaveOrUpdateCMSMenu(reqObj, false).subscribe((resp) => {
            //   if (resp.isSuccess) {
                
            //   }
            // })
            // const req = {
            //   menuId: item.id
            // }
            // this.manageWebsiteService.DraftDelete(req).subscribe((resp) => {
            //   if(resp.isSuccess) {
            //   }
            // })
          } else {
            this.notificationService.errorTopRight('Something went wrong.');
          }
        })
      } else {
        this.notificationService.errorTopRight('No container found for this page.')
      }
    });
  }
  openDeleteConfirmationDialog(id: any, content: any) {
    this.deleteElement = id;
    this.modalReference = this._matDialog.open(content, {
      data: { elementId: this.deleteElement }
    });
  }

  deleteDraftMenu() {
    if (!this.deleteElement) return;
    this.manageWebsiteService.DeleteCMSMenu({}, this.deleteElement).subscribe((resp) => {
      if (resp.isSuccess) {
        this.notificationService.successTopRight('Page Deleted Successfully.');
        this.fetchCMSMenu();
        this.selectedManagePageId = null;
        this.modalReference.close();
      } else {
        this.notificationService.errorTopRight('Something went wrong.');
      }
    });
  }
  
  bulkSave() {
    this.sideNavArray.forEach((item) => {
      item['isEdit'] = false;
    })
    this.sideNavSubItemArray.forEach((item) => {
      item['isEdit'] = false;
    })
    let req = [
      ...this.sideNavArray.map((items) => ({
        "id": items.id,
        "menuName": items.menuName,
        "menuId": items.menuId,
        "routerLink": items.routerLink,
        "symbolName": items.symbolName,
        "subMenuId": items.subMenuId,
        "draftDeleted": items.draftDeleted,
        "scheduledDateTime": items.scheduledDateTime,
        "scheduledId": items.scheduledId,
        "createdDateTime": items.createdDateTime,
        "modifyDateTime": items.modifyDateTime,
        "tenantCode": items.tenantCode,
        "isPublish": items.isPublish,
        "isDelete": items.isDelete,
        "isShare": items.isShare,
        "isHide": items.isHide,
        "publishedId":items.publishedId ? items.publishedId : '00000000-0000-0000-0000-000000000000'
      })),
      ...this.sideNavSubItemArray.map((items) => ({
        "id": items.id,
        "menuName": items.menuName,
        "menuId": items.menuId,
        "routerLink": items.routerLink,
        "symbolName": items.symbolName,
        "subMenuId": items.subMenuId,
        "draftDeleted": items.draftDeleted,
        "scheduledDateTime": items.scheduledDateTime,
        "scheduledId": items.scheduledId,
        "createdDateTime": items.createdDateTime,
        "modifyDateTime": items.modifyDateTime,
        "tenantCode": items.tenantCode,
        "isPublish": items.isPublish,
        "isDelete": items.isDelete,
        "isShare": items.isShare,
        "isHide": items.isHide,
        "publishedId":items.publishedId ? items.publishedId : '00000000-0000-0000-0000-000000000000'
      }))
    ];
    this.manageWebsiteService.BulkSaveOrUpdateCMSMenu(req, this.showChild).subscribe((resp) => {
      if(resp.isSuccess) {
        this.notificationService.successTopRight('Changes Saved SuccessFully.');
        this.fetchCMSMenu()
        this.editHeaderFlag = false;
      } else {
        this.notificationService.errorTopRight('Something went wrong.');
      }
    })
  }
  getPublishedContainers() {
    this.trainingEmbededVideo = null;
    this.manageWebsiteService.GetAllCMSContainer(this.selectedManagePageId, true).subscribe((resp) => {
      this.sectionsArray = resp
      .filter((items) => !(items.type === 'panel' && (!items.getAllCMSItemViews || items.getAllCMSItemViews.length === 0)))
      .map((items) => ({
        "type": items.type,
        "className": items.className,
        "containerId": items.containerId,
        "id": items.id,
        "isVideo": items.isVideo,
        "text": items.text,
        "selectedIndex": 0,
        "chartHeading": items.chartHeading,
        "salesHeading": items.salesHeading,
        "getAllCMSItemViews": items.type === 'panel' 
          ? items.getAllCMSItemViews.map((item) => ({
              "id": item.uploadId,
              "isVideo": item.isVideo,
              "bannerHeading": item.bannerHeading,
              "newHeadings": item.newHeadings,
              "uniqueId": item.uniqueId,
              "bannerSubHeading": item.bannerSubHeading,
              "videoFile": null,
              "ImageFile": null,
              "url": item.url,
              "Content": item.content,
              "type": item.type,
              "panelType": "panel",
              "fullBleed": item.fullBleed,
              "fitWidth": item.fitWidth,
              "opacity": item.opacity
            })) 
          : items.getAllCMSItemViews,
      }));

      this.sectionsArray.forEach((item) => {
        if(item.type === 'TrainingMonth' && item.text) {
          this.trainingEmbededVideo = this.sanitizer.bypassSecurityTrustResourceUrl(item.text)
        }
      })
      // this.sectionObject = {
      //   isPie: false,
      //   isLine: false,
      //   isbar: false,
      //   academy: false,
      //   all: false,
      //   credit: false,
      //   redemption: false,
      //   article: true,
      //   messages: false,
      //   singlepanel: false,
      //   text: false,
      //   goalTracker: true,
      //   trainingMonth: false,
      // }
      // this.sectionsArray.forEach((item) => {
      //   this.checkSelection(item.type)
      // })
    })
  }
  getContainers() {
    this.trainingEmbededVideo = null;
    this.manageWebsiteService.GetAllCMSContainer(this.selectedManagePageId, false).subscribe((resp) => {
      this.sectionsArray = resp
      .filter((items) => !(items.type === 'panel' && (!items.getAllCMSItemViews || items.getAllCMSItemViews.length === 0)))
      .map((items) => ({
        "type": items.type,
        "className": items.className,
        "containerId": items.containerId,
        "id": items.id,
        "isVideo": items.isVideo,
        "text": items.text,
        "selectedIndex": 0,
        "chartHeading": items.chartHeading,
        "salesHeading": items.salesHeading,
        "getAllCMSItemViews": items.type === 'panel' 
          ? items.getAllCMSItemViews.map((item) => ({
              "id": item.uploadId,
              "isVideo": item.isVideo,
              "bannerHeading": item.bannerHeading,
              "uniqueId": item.uniqueId,
              "newHeadings": item.newHeadings,
              "bannerSubHeading": item.bannerSubHeading,
              "videoFile": null,
              "ImageFile": null,
              "url": item.url,
              "Content": item.content,
              "type": item.type,
              "panelType": "panel",
              "fullBleed": item.fullBleed,
              "fitWidth": item.fitWidth,
              "opacity": item.opacity
            })) 
          : items.getAllCMSItemViews,
      }));

      this.sectionsArray.forEach((item) => {
        if(item.type === 'TrainingMonth' && item.text) {
          this.trainingEmbededVideo = this.sanitizer.bypassSecurityTrustResourceUrl(item.text)
        }
      })
      this.previousStateStogage = []
      this.currentStateIndex = 0;
      this.previousStateStogage.push(this.deepCopy(this.sectionsArray));
      // this.sectionObject = {
      //   isPie: false,
      //   isLine: false,
      //   isbar: false,
      //   academy: false,
      //   all: false,
      //   credit: false,
      //   redemption: false,
      //   article: true,
      //   messages: false,
      //   singlepanel: false,
      //   text: false,
      //   goalTracker: true,
      //   trainingMonth: false,
      // }
      // this.sectionsArray.forEach((item) => {
      //   this.checkSelection(item.type)
      // })
    })
  }
  showManagePagePopup() {
    this.showManagePage = true;
    this.manageForm = this._formbuilder.group({
      name: [null, Validators.required],
    })
  }
  saveManagePage(event) {
    event.stopPropagation();
    if(this.manageForm.invalid) {
      this.notificationService.errorTopRight('Please Provide Page Name')
    } else {
      let inputName = this.manageForm.value.name.toLowerCase().trim().replace(/\s+/g, '');
      let isDuplicate = this.navigationArray.some(
        (item) => item.menuName.toLowerCase().trim().replace(/\s+/g, '') === inputName
      );
      if (isDuplicate) {
        this.notificationService.errorTopRight('Please Provide Unique Name');
      } else {
        this.manageWebsiteService.SaveOrUpdateCMSMenu({
          "id": "00000000-0000-0000-0000-000000000000",
          "menuName": this.manageForm.value.name,
          "menuId": "",
          "routerLink": "",
          "symbolName": "",
          "tenantCode": environment.tentantcode,
          "isHide": false,
          "isShare": true,
          "isPublish": true,
          "isDelete": true,
          "publishedId": '00000000-0000-0000-0000-000000000000'
        }).subscribe((resp) => {
          if(resp.isSuccess) {
            this.notificationService.successTopRight('New page created successfully.')
            this.showManagePage = false;
            this.showMenuManagePage = false;
            this.fetchCMSMenu();
          }
        })
      }
    }
  }
  previousValue: string = '';
  editNavigationName(items, i) {
    // items['isEdit'] = true;
    let duplicateEntry = this.sideNavArray.some(item => item['isEdit'] === true) || this.sideNavSubItemArray.some(item => item['isEdit'] === true)
    if(duplicateEntry) {
      this.notificationService.errorTopRight('Only one navigation item can be edited at a time.')
    } else {
      items['isEdit'] = true;
      this.previousValue = items.menuName
      this.hideAddNavOption = true;
    }
  }
  checkDuplicateNavigation(menuName, items) {
    if (!menuName || menuName.trim() === '') {
      this.notificationService.errorTopRight('Name cannot be empty');
      return;
    }
    let inputName = menuName.toLowerCase().trim().replace(/\s+/g, '');
    let isDuplicate =
      this.sideNavArray.some(item => item.menuName.toLowerCase().trim().replace(/\s+/g, '') === inputName) ||
      this.sideNavSubItemArray.some(item => item.menuName.toLowerCase().trim().replace(/\s+/g, '') === inputName);
    if (isDuplicate && this.previousValue.toLowerCase() !== menuName.toLowerCase()) {
      this.notificationService.errorTopRight('Please Provide Unique Name');
    } else {
      items.menuName = menuName;
      items['isEdit'] = false;
      this.hideAddNavOption = false;
    }
  }
  saveChildManageUrlPage(event) {
    event.stopPropagation();
    if(this.childNavForm.invalid) {
      this.notificationService.errorTopRight('Please fill all the mandatory fields.')
    } else {
      let inputName = this.childNavForm.value.name.toLowerCase().trim().replace(/\s+/g, '');
      let isDuplicate =
        this.sideNavArray.some(item => item.menuName.toLowerCase().trim().replace(/\s+/g, '') === inputName) ||
        this.sideNavSubItemArray.some(item => item.menuName.toLowerCase().trim().replace(/\s+/g, '') === inputName);
      if (isDuplicate) {
        this.notificationService.errorTopRight('Please Provide Unique Name');
      } else {
        this.manageWebsiteService.SaveOrUpdateCMSMenu({
          "id": "00000000-0000-0000-0000-000000000000",
          "menuName": this.childNavForm.value.name,
          "menuId": this.childNavForm.value.menuType,
          "routerLink": this.childNavForm.value.url,
          "symbolName": "",
          "subMenuId": this.childNavForm.value.itemId,
          "tenantCode": environment.tentantcode,
          "isHide": false,
          "isShare": false,
          "isPublish": false,
          "isDelete": true,
          "publishedId": '00000000-0000-0000-0000-000000000000'
        }).subscribe((resp) => {
          if(resp.isSuccess) {
            this.notificationService.successTopRight('New sub menu created successfully.')
            this.showManagePage = false;
            this.showMenuManagePage = false;
            this.fetchCMSMenu();
          }
        })
      }
    }
  }
  saveManageUrlPage(event) {
    event.stopPropagation();
    if(this.manageNavForm.invalid) {
      this.notificationService.errorTopRight('Please fill all the mandatory fields.')
    } else {
      let inputName = this.manageNavForm.value.name.toLowerCase().trim().replace(/\s+/g, '');
      let isDuplicate =
        this.sideNavArray.some(item => item.menuName.toLowerCase().trim().replace(/\s+/g, '') === inputName) ||
        this.sideNavSubItemArray.some(item => item.menuName.toLowerCase().trim().replace(/\s+/g, '') === inputName);
      if (isDuplicate) {
        this.notificationService.errorTopRight('Please Provide Unique Name');
      } else {
        this.manageWebsiteService.SaveOrUpdateCMSMenu({
          "id": "00000000-0000-0000-0000-000000000000",
          "menuName": this.manageNavForm.value.name,
          "menuId": this.manageNavForm.value.menuType,
          "routerLink": this.manageNavForm.value.url ? this.manageNavForm.value.url : '',
          "symbolName": "",
          "tenantCode": environment.tentantcode,
          "isHide": false,
          "isShare": false,
          "isPublish": false,
          "isDelete": true,
          "publishedId": '00000000-0000-0000-0000-000000000000'
        }).subscribe((resp) => {
          if(resp.isSuccess) {
            this.notificationService.successTopRight('New menu created successfully.')
            this.showManagePage = false;
            this.showMenuManagePage = false;
            this.fetchCMSMenu();
          }
        })
      }
    }
  }
  onResize(event) {
    let chartWidth = event.target.innerWidth > 1100 ? 244 : event.target.innerWidth <= 1100 && event.target.innerWidth > 700 ? event.target.innerWidth - 240 : event.target.innerWidth <= 700 && event.target.innerWidth > 400 ? event.target.innerWidth - 150 : event.target.innerWidth - 80;
    this.view = [chartWidth, 300];
  }
  changeLogoPopup() {
    this.showLogoPopup = !this.showLogoPopup;
    if(this.showLogoPopup) {
      this.siteForm = this._formbuilder.group({
        site: [this.logoTitle],
      });
    }
    this.getLogoHeader();
  }
  getLogoHeader() {
    this.manageWebsiteService.GetAllCMSHeader(!this.showChild).subscribe((resp) => {
      if(resp && resp.length > 0) {
        this.logoId = resp[0].id;
        this.logoUrl = resp[0].logo;
        this.logoTitle = resp[0].title;
      } else {
        this.logoUrl = null;
        this.logoTitle = null;
        this.logoUrl = this.localAsset;
      }
    })
  }
  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif'];
  
      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        this.notificationService.errorTopRight('Please upload a valid image file (PNG, JPG, JPEG, GIF)');
        input.value = '';
        return;
      }
  
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.file = reader.result as string;
        this.fileName = file.name;
        if (this.logoUrl) {
          URL.revokeObjectURL(this.logoUrl);
        }
        this.logoUrl = URL.createObjectURL(file);
        this.siteForm.get('site').disable();
        this.siteForm.get('site').setValue('');
      };
    }
  }
  
  clearLogo(event: Event) {
    event.stopPropagation();
    if (this.logoUrl) {
      URL.revokeObjectURL(this.logoUrl);
    }
    this.file = null;
    this.fileName = '';
    this.logoUrl = this.localAsset;
    this.siteForm.get('site').enable();
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
  


  addNewSlide() {
    this.slideContainer.push({
      "id": '00000000-0000-0000-0000-000000000000',
      "isVideo": false,
      "url": "",
      "uniqueId": this.getNanoTimestampWithRandomString(),
      "Content": "",
      "bannerHeading": "",
      "bannerSubHeading": "",
      "newHeadings": [],
      "type": "image",
      "panelType": "panel",
      "fullBleed": "",
      "fitWidth": "",
      "opacity": ""
    })
    this.sectionContainer[0]['isEdit'] = false;
    this.sectionContainer[0]['showPanel'] = true;
  }
  addNewExistingSlide(item) {
    this.slideContainer.push({
      id: '00000000-0000-0000-0000-000000000000',
      "isVideo": false,
      "url": "",
      "Content": "",
      "bannerHeading": "",
      "uniqueId": this.getNanoTimestampWithRandomString(),
      "bannerSubHeading": "",
      "newHeadings": [],
      "type": "image",
      "panelType": "panel",
      "fullBleed": "",
      "fitWidth": "",
      "opacity": ""
    })
    item['isEdit'] = false;
    item['showPanel'] = true;
  }
  editSlide(){
    // this.slideContainer.push(this.sectionContainer[0].getAllCMSItemViews[this.sectionContainer[0]['selectedIndex']])
    if(this.sectionContainer[0].type === 'panel') {
      this.slideContainer = this.sectionContainer[0].getAllCMSItemViews;
    }
    this.sectionContainer[0]['isEdit'] = true;
    this.sectionContainer[0]['showPanel'] = true;
  }
  cancelSection() {
    // this.checkSelection(this.sectionContainer[0].type)
    this.sectionsArray.splice(this.indexToPush, 0, this.deepCopy(this.clonedSection));
    this.sectionContainer = [];
    this.clonedSection = null;
    this.addSection = false;
    this.slideContainer = [
      {
        "id": '00000000-0000-0000-0000-000000000000',
        "isVideo": false,
        "uniqueId": this.getNanoTimestampWithRandomString(),
        "url": "",
        "Content": "",
        "bannerHeading": "",
        "bannerSubHeading": "",
        "newHeadings": [],
        "type": "image",
        "panelType": "panel",
        "fullBleed": "",
        "fitWidth": "",
        "opacity": ""
      }
    ]
  }

  deepCopyWithFile(obj: any): any {
    const copy = JSON.parse(JSON.stringify(obj));
    if (obj.getAllCMSItemViews && obj.getAllCMSItemViews.length > 0) {
      obj.getAllCMSItemViews.forEach((view: any, index: number) => {
        if (view.ImageFile instanceof File) {
          copy.getAllCMSItemViews[index].ImageFile = view.ImageFile;
        }
      });
    }
    return copy;
  }
  deepCopyContainerWithFile(getAllCMSItemViews: any): any {
    const copy = JSON.parse(JSON.stringify(getAllCMSItemViews));
    if (getAllCMSItemViews && getAllCMSItemViews.length > 0) {
      getAllCMSItemViews.forEach((view: any, index: number) => {
        if (view.ImageFile instanceof File) {
          copy[index].ImageFile = view.ImageFile;
        }
      });
    }
    return copy;
  }
      
  editExistingSlide(item, i){
    if(item.type === 'panel') {
      this.clonedSection = this.deepCopyWithFile(item)
      this.sectionContainer[0] = this.deepCopyWithFile(item)
      this.slideContainer = this.deepCopyContainerWithFile(item.getAllCMSItemViews);
      this.addSection = true;
    }
    this.sectionsArray.splice(i, 1)
    // this.slideContainer.push(item.getAllCMSItemViews[item['selectedIndex']])
    item['isEdit'] = true;
    item['showPanel'] = true;
  }
  // removeImageSlide(i)
  deleteSlide() {
    this.sectionContainer[0].getAllCMSItemViews.splice(this.sectionContainer[0]['selectedIndex'], 1);
    this.sectionContainer[0]['selectedIndex'] = 0;
    this.sectionContainer[0]['isEdit'] = false;
    this.sectionContainer[0]['showPanel'] = false;
    this.slideContainer.push({
      "id": '00000000-0000-0000-0000-000000000000',
      "isVideo": false,
      "url": "",
      "Content": "",
      "uniqueId": this.getNanoTimestampWithRandomString(),
      "bannerHeading": "",
      "bannerSubHeading": "",
      "newHeadings": [],
      "type": "image",
      "panelType": "panel",
      "fullBleed": "",
      "fitWidth": "",
      "opacity": ""
    })
  }
  deleteExistingSlide() {
    const PanelConatiner = this.sectionsArray.filter(x => x.type === 'panel');
    PanelConatiner[0].getAllCMSItemViews.splice(PanelConatiner[0]['selectedIndex'], 1);
    PanelConatiner[0]['selectedIndex'] = 0;
    PanelConatiner[0]['isEdit'] = false;
    PanelConatiner[0]['showPanel'] = false;
    this.slideContainer.push({
      "id": '00000000-0000-0000-0000-000000000000',
      "isVideo": false,
      "url": "",
      "Content": "",
      "uniqueId": this.getNanoTimestampWithRandomString(),
      "bannerHeading": "",
      "bannerSubHeading": "",
      "newHeadings": [],
      "type": "image",
      "panelType": "panel",
      "fullBleed": "",
      "fitWidth": "",
      "opacity": ""
    })
  }
  removeExistingSlide() {
    const PanelConatiner = this.sectionsArray.filter(x => x.type === 'panel');
    this.slideContainer.push({
      "id": '00000000-0000-0000-0000-000000000000',
      "isVideo": false,
      "url": "",
      "Content": "",
      "uniqueId": this.getNanoTimestampWithRandomString(),
      "bannerHeading": "",
      "bannerSubHeading": "",
      "newHeadings": [],
      "type": "image",
      "panelType": "panel",
      "fullBleed": "",
      "fitWidth": "",
      "opacity": ""
    })
    PanelConatiner[0]['showPanel'] = false;
    PanelConatiner[0]['selectedIndex'] = 0;
    this.videoFiles = null;
  }
  removeSlide() {
    this.slideContainer = [{
      "id": '00000000-0000-0000-0000-000000000000',
      "isVideo": false,
      "url": "",
      "Content": "",
      "uniqueId": this.getNanoTimestampWithRandomString(),
      "bannerHeading": "",
      "bannerSubHeading": "",
      "newHeadings": [],
      "type": "image",
      "panelType": "panel",
      "fullBleed": "",
      "fitWidth": "",
      "opacity": ""
    }]
    this.sectionContainer[0]['showPanel'] = false;
    this.sectionContainer[0]['selectedIndex'] = 0;
    this.videoFiles = null;
  }
  saveExistingSlide() {
    const PanelConatiner = this.sectionsArray.filter(x => x.type === 'panel');
    if (this.slideContainer['isEdit'] = true) {
      PanelConatiner[0].getAllCMSItemViews.splice(PanelConatiner[0]['selectedIndex'], 1);
    }
    PanelConatiner[0].getAllCMSItemViews.push({...this.slideContainer});
    PanelConatiner[0]['showPanel'] = false;
    PanelConatiner[0]['selectedIndex'] = 0;
    this.slideContainer.push({
      "id": '00000000-0000-0000-0000-000000000000',
      "isVideo": false,
      "url": "",
      "Content": "",
      "uniqueId": this.getNanoTimestampWithRandomString(),
      "bannerHeading": "",
      "bannerSubHeading": "",
      "newHeadings": [],
      "type": "image",
      "panelType": "panel",
      "fullBleed": "",
      "fitWidth": "",
      "opacity": ""
    })
  }
  saveSlide() {
    this.videoFiles = null;
    this.sectionContainer[0].getAllCMSItemViews=this.slideContainer;
    console.log('this.sectionContainer[0].getAllCMSItemViews', this.sectionContainer[0].getAllCMSItemViews)
    this.sectionContainer[0]['showPanel'] = false;
    this.sectionContainer[0]['selectedIndex'] = 0;
    this.slideContainer = [{
      "id": '00000000-0000-0000-0000-000000000000',
      "isVideo": false,
      "url": "",
      "Content": "",
      "uniqueId": this.getNanoTimestampWithRandomString(),
      "bannerHeading": "",
      "bannerSubHeading": "",
      "newHeadings": [],
      "type": "image",
      "panelType": "panel",
      "fullBleed": "",
      "fitWidth": "",
      "opacity": ""
    }]
  }
  onVideoFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const allowedTypes = ["video/mp4", "video/webm", "video/ogg"];
      if (!allowedTypes.includes(file.type)) {
        this.notificationService.errorTopRight("Invalid file type! Please select a video file (MP4, WebM, OGG).");
        input.value = "";
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        this.notificationService.errorTopRight("File size exceeds 20MB limit!");
        input.value = "";
        return;
      }
      this.slideContainer[0].url = URL.createObjectURL(file);
      this.slideContainer[0].Content = ''
      this.slideContainer[0]['videoFile'] = file
      input.value = "";
    }
  }
  markToAddTemplate(item) {
    item['addToTemplate'] = !item['addToTemplate'];
    if(item['addToTemplate']) {
      this.notificationService.successTopRight('The image has been marked for addition to the templates. It will be added once you save the changes.')
    }
  }
  removeAddedVideoSlide() {
    this.slideContainer[0].url = '';
    this.videoFiles = null;
  }
  sanitizeVideoUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  addNewSLide() {
    this.slideContainer.push({
      "id": '00000000-0000-0000-0000-000000000000',
      "isVideo": false,
      "url": "",
      "Content": "",
      "uniqueId": this.getNanoTimestampWithRandomString(),
      "bannerHeading": "",
      "bannerSubHeading": "",
      "newHeadings": [],
      "type": "image",
      "panelType": "panel",
      "fullBleed": "",
      "fitWidth": "",
      "opacity": ""
    })
    this.sectionContainer[0]['showPanel'] = true
  }
  onVideoUrlChange(value: string): void {
    this.slideContainer[0].url = '';
    this.videoFiles = null;
    if(this.isValidVideoUrl(this.slideContainer[0].Content)) {
      if (this.slideContainer[0].Content.includes('vimeo.com')) {
        this.urlService.getVimeoEmbedUrl(this.slideContainer[0].Content).subscribe((resp) => {
          const embedUrl = this.urlService.extractIframeUrl(resp.html)
          if (embedUrl === '' || embedUrl === null) {
            this.notificationService.errorTopRight('Provided URl is not valid.')
          } else {
            this.slideContainer[0].Content = embedUrl;
            this.slideContainer['EmbeddedVideo'] = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl)
          }
        })
      } else {
        const embedUrl = this.urlService.constructEmbedUrl(this.slideContainer[0].Content);
        if (embedUrl === '' || embedUrl === null) {
          this.notificationService.errorTopRight('Provided URl is not valid.')
        } else {
          this.slideContainer[0].Content = embedUrl;
          this.slideContainer['EmbeddedVideo'] = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl)
        }
      }
    } else {
      this.slideContainer['EmbeddedVideo'] = ''
      this.notificationService.errorTopRight('Please provide valid youtube or vimeo url.')
    }
  }
  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.sideNavArray, event.previousIndex, event.currentIndex);
  }
  dropSubItem(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.sideNavSubItemArray, event.previousIndex, event.currentIndex);
  }
  onBannerFileSelect(event: Event, item) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif'];
  
      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        this.notificationService.errorTopRight('Please upload a valid image file (PNG, JPG, JPEG, GIF)');
        input.value = '';
        return;
      }
  
      const blobUrl = URL.createObjectURL(file);
      item.url = blobUrl;
      item['ImageFile'] = file;
  
      input.value = '';
    }
  }
  
  
  saveSiteInfo() {
    if (!this.file && !this.siteForm.value.site) {
      this.notificationService.errorTopRight('Either logo or site title is required');
      return;
    }
  
    const payload = {
      id: this.logoId,
      title: this.siteForm.value.site || '',
      logo: this.file,
      tenantCode: environment.tentantcode
    };
  
    this.manageWebsiteService.SaveOrUpdateCMSHeader(false, payload).subscribe((resp) => {
      if (resp.isSuccess) {
        this.getLogoHeader();
        this.showLogoPopup = false;
        this.notificationService.successTopRight('Changes saved successfully.');
      }
    });
  }
  
  calculateWidth(totalCourse: number, totalAttempted: number): number {
    if (totalCourse === 0) {
      return 0;
    }
    const result = (totalAttempted / totalCourse) * 100;
    return parseFloat(result.toFixed(2));
  }
  getItemClass(index: number, items: any[], currentItem: string): string {
    let rowIndex = Math.floor(index / 2);
    let rowItems = items.slice(rowIndex * 2, rowIndex * 2 + 2);
  
    let hasAcademy = rowItems.includes("Academy");
  
    if (currentItem === "Academy") {
      return "academy-item";
    }
  
    if (rowItems.length === 1) {
      return "single-item";
    }
  
    return hasAcademy ? "flex-item" : "equal-item";
  }
  formatNumberWithCommas(value): string {
    if (value == null) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  handleMenuClick() {
    this.showMenu = this.showMenu ? false : true;
    this.showLink = false;
    this.showMenuManagePage = false;
  }
  duplicateClone(item, i) {
    const newItem = this.deepCopy(item);
    newItem.id = '00000000-0000-0000-0000-000000000000',
    newItem.containerId = this.getNanoTimestampWithRandomString(),
    this.sectionsArray.splice(i + 1, 0, newItem);
    this.storeState();
  }
  newSection(type: string) {
    this.clonedSection = null;
    this.containerPopup = false;
    
    // Calculate space needed for the new container
    let spaceNeeded = 100; // Default to full width
    if (this.sectionContainer.length > 0) {
      // If we're adding to existing containers, determine available space
      spaceNeeded = this.availableSpace;
    }
    
    const newContainer = {
      containerId: this.getNanoTimestampWithRandomString(),
      type: type,
      className: this.determineOptimalSize(spaceNeeded),
      isVideo: false,
      showOption: false,
      position: this.determinePosition(),
      salesHeading: type === 'Line Chart' ? '<h3>Total Sales</h3>\n' : '',
      text: type === 'Pie Chart' ? '<h3>Sales By Category</h3>\n' : 
            type === 'Line Chart' ? '<h3>Total Points</h3>\n' : 
            type === 'Bar Chart' ? '<h3>Total List Price Sales</h3>\n' : 
            type === 'Text' ? '<h3><span style=\"font-size:36px;\"><span style=\"color:#02479c;\">Good Morning, Kohler Admin</span></span></h3>\n' : '',
      chartHeading: type === 'TrainingMonth' ? '<h2>Training of the Month</h2>\n' : 
                    type === 'Line Chart' || type === 'Pie Chart' || type === 'Bar Chart' ? '<p><span style=\"font-size:14px;\">Performance</span></p>\n' : 
                    type === 'Academy' ? '<h3><span style=\"font-size:28px;\">Academy Curriculums</span></h3>\n' : 
                    type === 'All' ? '<h3>All Transactions</h3>\n' : 
                    type === 'Credit' ? '<h3>Credit Details</h3>\n' : 
                    type === 'Redemptions' ? '<h3>Redemption Details</h3>\n' : 
                    type === 'Messages' ? '<h3>You have Messages!</h3>\n' : '',
      "getAllCMSItemViews": [],
    };
    
    if (this.sectionContainer.length === 0) {
      this.sectionContainer = [newContainer];
    } else {
      // Check if we need to move to a new row
      const containerWidth = this.getWidthPercentage(newContainer.className);
      if (this.availableSpace < containerWidth) {
        this.currentRow++;
        this.availableSpace = 100; // Reset for new row
      }
      
      this.sectionContainer.push(newContainer);
      this.availableSpace -= containerWidth;
    }
    
    if (type === 'panel') {
      this.sectionContainer[this.sectionContainer.length - 1]['showPanel'] = true;
      this.slideContainer = [{
        "id": '00000000-0000-0000-0000-000000000000',
        "uniqueId": this.getNanoTimestampWithRandomString(),
        "isVideo": false,
        "url": "",
        "Content": "",
        "bannerHeading": "",
        "bannerSubHeading": "",
        "newHeadings": [
          {
            "text": "<p><span style=\"font-size:24px;\"><span style=\"color:#ffffff;\">​​​​​​​NEWS YOU CAN USE</span></span></p>\n",
            "x": 2.76100086281277,
            "y": 13.768115942028986
          },
          {
            "text": "<h2><span style=\"color:#ffffff;\">​​​​​​​Q1 2025 Program Overview</span></h2>\n",
            "x": 2.76100086281277,
            "y": 24.879227053140095
          },
          {
            "text": "<p><span style=\"color:#ffffff;\"><span style=\"font-size:24px;\">​​​​​​​Learn more about the Kohler Preferred Partners Program today!</span></span></p>\n",
            "x": 2.8472821397756687,
            "y": 43.47826086956522
          }
        ],
        "type": "image",
        "panelType": "panel",
        "fullBleed": "",
        "fitWidth": "",
        "opacity": ""
      }];
    }
  }
  getContainerRows(): any[][] {
    const rows: any[][] = [];
    
    this.sectionContainer.forEach(container => {
      const rowIndex = container.position?.row || 0;
      if (!rows[rowIndex]) {
        rows[rowIndex] = [];
      }
      rows[rowIndex].push(container);
    });
    
    return rows;
  }
  resizeContainer(size: string, container: any) {
    switch (size) {
      case 'wfull':
        container.className = 'wfull';
        break;
      case 'wtwobythree':
        container.className = 'wtwobythree';
        break;
      case 'wonebytwo':
        container.className = 'wonebytwo';
        break;
      case 'wonebythree':
        container.className = 'wonebythree';
        break;
      default:
        container.className = '';
    }
    this.updateAvailableSpace();
  }
  updateAvailableSpace() {
    this.availableSpace = 100; 
    this.sectionContainer.forEach(container => {
      const containerWidth = this.getWidthPercentage(container.className);
      this.availableSpace -= containerWidth;
    });
  }

  
  getWidthPercentage(className: string): number {
    switch (className) {
      case 'wfull': return 100;
      case 'wtwobythree': return 66.67;
      case 'wonebytwo': return 50;
      case 'wonebythree': return 33.33;
      default: return 100;
    }
  }
  openContainerPopup(event: MouseEvent) {
    event.stopPropagation();
    this.containerPopup = true;
    // Reset any selection if needed
    this.clonedSection = null;
  }
  
  // Helper method to determine optimal size based on available space
  determineOptimalSize(availableSpace: number): string {
    if (availableSpace >= 100) return 'wfull';
    if (availableSpace >= 66.67) return 'wtwobythree';
    if (availableSpace >= 50) return 'wonebytwo';
    if (availableSpace >= 33.33) return 'wonebythree';
    return 'wonebythree'; // Smallest possible size
  }
  
  // Helper method to determine position
  determinePosition(): { row: number, col: number } {
    // Simple implementation - you might need to enhance this
    return {
      row: this.currentRow,
      col: this.sectionContainer.filter(c => c.position?.row === this.currentRow).length
    };
  }
  

  
  // Method to recalculate the entire layout
  recalculateLayout() {
    let currentRow = 0;
    let rowSpace = 100;
    
    this.sectionContainer.forEach(container => {
      const containerWidth = this.getWidthPercentage(container.className);
      
      if (rowSpace < containerWidth) {
        // Move to next row
        currentRow++;
        rowSpace = 100;
      }
      
      // Update container position
      container.position = {
        row: currentRow,
        col: this.sectionContainer
          .filter(c => c.position?.row === currentRow && 
                 c.containerId !== container.containerId).length
      };
      
      rowSpace -= containerWidth;
    });
    
    this.currentRow = currentRow;
    this.availableSpace = rowSpace;
  }
  addAnotherImage() {
    const checkImages = this.slideContainer.every(item => item.url);
    if(checkImages) {
      this.slideContainer.push({
        "id": '00000000-0000-0000-0000-000000000000',
        "isVideo": false,
        "url": "",
        "Content": "",
        "uniqueId": this.getNanoTimestampWithRandomString(),
        "bannerHeading": "",
        "bannerSubHeading": "",
        "newHeadings": [
          {
            "text": "<p><span style=\"font-size:24px;\"><span style=\"color:#ffffff;\">​​​​​​​NEWS YOU CAN USE</span></span></p>\n",
            "x": 2.76100086281277,
            "y": 13.768115942028986
          },
          {
            "text": "<h2><span style=\"color:#ffffff;\">​​​​​​​Q1 2025 Program Overview</span></h2>\n",
            "x": 2.76100086281277,
            "y": 24.879227053140095
          },
          {
            "text": "<p><span style=\"color:#ffffff;\"><span style=\"font-size:24px;\">​​​​​​​Learn more about the Kohler Preferred Partners Program today!</span></span></p>\n",
            "x": 2.8472821397756687,
            "y": 43.47826086956522
          }
        ],
        "type": "image",
        "panelType": "panel",
        "fullBleed": "",
        "fitWidth": "",
        "opacity": ""
      })
    } else {
      if(this.slideContainer.length > 1) {
        this.notificationService.errorTopRight('Please upload image to all the exiting slides.')
      } else {
        this.notificationService.errorTopRight('Please upload image to the existing slide.')
      }
    }
  }
  addAnotherBannerImage(item) {
    const checkImages = this.slideContainer.every(item => item.url);
    if(checkImages) {
      this.slideContainer.push({
        "id": '00000000-0000-0000-0000-000000000000',
        "isVideo": false,
        "url": "",
        "Content": "",
        "uniqueId": this.getNanoTimestampWithRandomString(),
        "bannerHeading": "",
        "bannerSubHeading": "",
        "newHeadings": [
          {
            "text": "<p><span style=\"font-size:24px;\"><span style=\"color:#ffffff;\">​​​​​​​NEWS YOU CAN USE</span></span></p>\n",
            "x": 2.76100086281277,
            "y": 13.768115942028986
          },
          {
            "text": "<h2><span style=\"color:#ffffff;\">​​​​​​​Q1 2025 Program Overview</span></h2>\n",
            "x": 2.76100086281277,
            "y": 24.879227053140095
          },
          {
            "text": "<p><span style=\"color:#ffffff;\"><span style=\"font-size:24px;\">​​​​​​​Learn more about the Kohler Preferred Partners Program today!</span></span></p>\n",
            "x": 2.8472821397756687,
            "y": 43.47826086956522
          }
        ],
        "type": "image",
        "panelType": "panel",
        "fullBleed": "",
        "fitWidth": "",
        "opacity": ""
      })
    } else {
      this.notificationService.errorTopRight('Please add images to all slides.')
    }
  }
  addNewText() {
    const selectedIndex = this.sectionContainer[0]['selectedIndex'];
    if (!this.sectionContainer[0].getAllCMSItemViews[selectedIndex].newHeadings) {
      this.sectionContainer[0].getAllCMSItemViews[selectedIndex].newHeadings = [];
    }
    const textItems = this.sectionContainer[0].getAllCMSItemViews[selectedIndex].newHeadings;
  
    const imageRef = document.querySelector('.carousel-item img') as HTMLElement;
    if (!imageRef) return;
  
    const imageRect = imageRef.getBoundingClientRect();
    const imageWidth = imageRect.width;
    const imageHeight = imageRect.height;
  
    let newX = 20; // Start x at 20%
    let newY = 10; // Start y at 10%
    const padding = 2; // Padding in percentage
    const textWidth = (100 / imageWidth) * 100; // Convert text width to percentage
    const textHeight = (30 / imageHeight) * 100; // Convert text height to percentage
  
    const isOverlapping = (x: number, y: number) => {
      return textItems.some(item =>
        x < item.x + textWidth + padding &&
        x + textWidth + padding > item.x &&
        y < item.y + textHeight + padding &&
        y + textHeight + padding > item.y
      );
    };
  
    while (isOverlapping(newX, newY)) {
      newX += 20; // Increment x by 20% if overlapping
      if (newX + textWidth > 100) { // If x exceeds the container width
        newX = 20; // Reset x to 20%
        newY += 10; // Move down by 10%
      }
      if (newY + textHeight > 100) { // If y exceeds the container height, stop
        break;
      }
    }
  
    textItems.push({ text: '', x: newX, y: newY });
  }
  
  
  addNewBannerText(item) {
    const selectedIndex = item['selectedIndex'];
    const textItems = item.getAllCMSItemViews[selectedIndex].newHeadings;
  
    const imageRef = document.querySelector('.carousel-item img') as HTMLElement;
    if (!imageRef) return;
  
    const imageRect = imageRef.getBoundingClientRect();
    const imageWidth = imageRect.width;
    const imageHeight = imageRect.height;
  
    let newX = 65;
    let newY = 65;
    const padding = 10;
    const textWidth = 100;
    const textHeight = 30;
  
    const isOverlapping = (x: number, y: number) => {
      return textItems.some(item => 
        x < item.x + textWidth + padding && 
        x + textWidth + padding > item.x &&
        y < item.y + textHeight + padding &&
        y + textHeight + padding > item.y
      );
    };
  
    while (isOverlapping(newX, newY)) {
      newX += 20;
      if (newX + textWidth > imageWidth) { 
        newX = 65;
        newY += 40;
      }
      if (newY + textHeight > imageHeight) { 
        break;
      }
    }
  
    textItems.push({ text: '', x: newX, y: newY });
  }  
  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
  removeNewText(i) {
    this.sectionContainer[0].getAllCMSItemViews[this.sectionContainer[0]['selectedIndex']].newHeadings.splice(i, 1)
  }
  removeNewBannerText(i, item) {
    item.getAllCMSItemViews[this.sectionContainer[0]['selectedIndex']].newHeadings.splice(i, 1)
  }
  removeImageSlide(index) {
    this.slideContainer.splice(index, 1)
    if(this.slideContainer.length === 1 && !this.slideContainer[0]['url'])
    this.sectionContainer[0].getAllCMSItemViews = [];
  }
  removeBannerImageSlide(index) {
    this.slideContainer.splice(index, 1)
    // if(this.slideContainer.length === 1 && !this.slideContainer[0]['url'])
    // this.sectionContainer[0].getAllCMSItemViews = [];
  }
  onDragBannerEnd(event: CdkDragEnd, textItem: any, item) {
    const { x, y } = event.source.getFreeDragPosition();
    const imgElement = document.getElementById('imageRef2') as HTMLImageElement;
    const imageRect = imgElement.getBoundingClientRect();
    
    const textElement = event.source.element.nativeElement;
    const textRect = textElement.getBoundingClientRect();
  
    textItem.x = Math.max(0, Math.min(x, imageRect.width - textRect.width));
    textItem.y = Math.max(0, Math.min(y, imageRect.height - textRect.height));
    textElement.style.transform = 'none';
  
    this.preventOverlap(textItem, textRect, true, item);
  }

  // resizeContainer(newSize: string) {
  //   const container = document.querySelector('.carousel-item') as HTMLElement;
  //   if (!container) return;

  //   const oldWidth = container.clientWidth;
  //   const oldHeight = container.clientHeight;

  //   this.sectionContainer[0].className = newSize;

  //   setTimeout(() => {
  //       const newWidth = container.clientWidth;
  //       const newHeight = container.clientHeight;

  //       this.sectionContainer[0].getAllCMSItemViews[this.sectionContainer[0]['selectedIndex']]
  //           .newHeadings.forEach((textItem) => {
  //               textItem.x = (textItem.x * newWidth) / oldWidth;
  //               textItem.y = (textItem.y * newHeight) / oldHeight;
  //           });
  //   }, 50);
  // }
  resizeitemContainer(newSize: string, item) {
    const container = document.querySelector('.carousel-item') as HTMLElement;
    if (!container) return;

    const oldWidth = container.clientWidth;
    const oldHeight = container.clientHeight;

    item.className = newSize;

    setTimeout(() => {
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;

        item.getAllCMSItemViews[item['selectedIndex']]
            .newHeadings.forEach((textItem) => {
                textItem.x = (textItem.x * newWidth) / oldWidth;
                textItem.y = (textItem.y * newHeight) / oldHeight;
            });
    }, 50);
  }

  
  preventOverlap(currentItem: any, currentRect: DOMRect, flag, container) {
    const textItems = flag ? container.getAllCMSItemViews[container['selectedIndex']].newHeadings : this.sectionContainer[0].getAllCMSItemViews[this.sectionContainer[0]['selectedIndex']].newHeadings;
    
    for (let item of textItems) {
      if (item !== currentItem) {
        const existingRect = document.querySelector(`[ngStyle*="'top.px': ${item.y}, 'left.px': ${item.x}"]`)?.getBoundingClientRect();
        
        if (existingRect && this.isOverlapping(currentRect, existingRect)) {
          currentItem.y += existingRect.height + 10;
        }
      }
    }
  }
  
  isOverlapping(rect1: DOMRect, rect2: DOMRect): boolean {
    return (
      rect1.left < rect2.right &&
      rect1.right > rect2.left &&
      rect1.top < rect2.bottom &&
      rect1.bottom > rect2.top
    );
  }
  
  // checkSelection(type) {
  //   switch (type) {
  //     case 'Pie Chart':
  //       this.sectionObject.isPie = true;
  //       break;
  //     case 'Line Chart':
  //       this.sectionObject.isLine = true;
  //       break;
  //     case 'Bar Chart':
  //       this.sectionObject.isbar = true;
  //       break;
  //     case 'Academy':
  //       this.sectionObject.academy = true;
  //       break;
  //     case 'All':
  //       this.sectionObject.all = true;
  //       break;
  //     case 'Credit':
  //       this.sectionObject.credit = true;
  //       break;
  //     case 'Redemptions':
  //       this.sectionObject.redemption = true;
  //       break;
  //     case 'Article':
  //       this.sectionObject.article = true;
  //       break;
  //     case 'Messages':
  //       this.sectionObject.messages = true;
  //       break;
  //     case 'panel':
  //       this.sectionObject.singlepanel = true;
  //       break;
  //     case 'Text':
  //       this.sectionObject.text = true;
  //       break;
  //     case 'TrainingMonth':
  //       this.sectionObject.trainingMonth = true;
  //       break;
  //     case 'GoalTracker':
  //       this.sectionObject.goalTracker = true;
  //       break;
  //     default:
  //       console.warn(`Unknown type: ${type}`);
  //   }
  // }
  saveSection() {
    this.clonedSection = null;
    if(this.sectionContainer[0].type === 'TrainingMonth') {
      this.trainingEmbededVideo = null;
      if(this.sectionContainer[0].text) {
        if(this.isValidVideoUrl(this.sectionContainer[0].text)) {
          if (this.sectionContainer[0].text.includes('vimeo.com')) {
            this.urlService.getVimeoEmbedUrl(this.sectionContainer[0].text).subscribe((resp) => {
              const embedUrl = this.urlService.extractIframeUrl(resp.html)
              if (embedUrl === '' || embedUrl === null) {
                this.notificationService.errorTopRight('Provided URl is not valid.')
              } else {
                this.sectionContainer[0].text = embedUrl;
                this.trainingEmbededVideo = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl)
                // this.checkSelection(this.sectionContainer[0].type)
                this.sectionsArray.splice(this.indexToPush, 0, this.sectionContainer[0]);
                this.sectionContainer = [];
                this.storeState();
                this.addSection = false;
              }
            })
          } else {
            const embedUrl = this.urlService.constructEmbedUrl(this.sectionContainer[0].text);
            if (embedUrl === '' || embedUrl === null) {
              this.notificationService.errorTopRight('Provided URl is not valid.')
            } else {
              this.sectionContainer[0].text = embedUrl;
              this.trainingEmbededVideo = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl)
              // this.checkSelection(this.sectionContainer[0].type)
              this.sectionsArray.splice(this.indexToPush, 0, this.sectionContainer[0]);
              this.sectionContainer = [];
              this.storeState();
              this.addSection = false;
            }
          }
        } else {
          this.notificationService.errorTopRight('Please provide valid youtube or vimeo url.')
        }
      } else {
        this.notificationService.errorTopRight('Please provide video url.')
      }
    } else {
      // this.checkSelection(this.sectionContainer[0].type)
      this.sectionsArray.splice(this.indexToPush, 0, this.sectionContainer[0]);
      this.sectionContainer = [];
      this.storeState();
      this.addSection = false;
    }
  }
  getClass(item) {
    if(!item['addnewSection']){
      return item.className
    } else return 'w-full'
  }
  isValidVideoUrl(url: string): boolean {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;
    const vimeoRegex = /^(https?:\/\/)?(www\.)?vimeo\.com\/\d+/;
    return youtubeRegex.test(url) || vimeoRegex.test(url);
  }
  addNewSection() {
    this.addSection = !this.addSection;
    this.sectionContainer = [];
    this.indexToPush = 0
    if(this.addSection){
      this.scrollToTop();
    }
  }
  onDragStartItem(event: CdkDragStart) {
    this.hideAddSection = true
  }
  scrollToTop() {
    this.scrollContainerItem.nativeElement.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onDragEndItem(event: CdkDragEnd, currentIndex: number) {
    this.hideAddSection = false;
    // this.scrollToTop();
  }
  addSectionWithPosition(item ,i) {
    this.sectionContainer = [];
    if(item['addnewSection']) {
      item['addnewSection'] = !item['addnewSection']
      this.indexToPush = 0
    } else {
      this.indexToPush = i+1
      item['addnewSection'] = !item['addnewSection']
    }
  }
  toggleSalesGraph(checked) {
    this.isSalesSelected = checked;
    window.sessionStorage.setItem('isSalesSelected', JSON.stringify(this.isSalesSelected));
    this.lineChartData.datasets = [this.isSalesSelected ? this.lineChartDataset[0] : this.lineChartDataset[1]];
    if (this.baseChart) {
      this.baseChart.update();
    }
  }
  fetchNavigationArray() {
    this.manageWebsiteService.GetAllCMSMenu(false).subscribe((res) => {
      this.enableManagePage = false;
      res.forEach((item) => {
        if(item.menuId === 'HM') {
          item['selected'] = true;
          this.showChild = false;
          this.fetchCMSMenu();
          this.getLogoHeader();
          this.selectedManagePageId = item.id;
          this.manageWebsiteService.GetKeyValidation(this.selectedManagePageId, 'publish').subscribe((validationResp) => {
            if((validationResp?.id && validationResp?.key && validationResp?.validDateTime) && !validationResp?.expire) {
              const utcDate = new Date(validationResp?.validDateTime + 'Z');
              const estDate = new Intl.DateTimeFormat('en-US', {
                timeZone: 'America/New_York',
                month: '2-digit', day: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit', hour12: false
              }).format(utcDate);
              this.publishLinkDate = estDate.replace(',', '');
            } else {
              this.publishLinkDate = null;
            }
          })
          this.getPublishedContainers();
        }
        if(item.menuId === 'HM' && item?.draftDeleted) {
          this.enableManagePage = true;
        }
        if(item.modifyDateTime) {
          const utcDate = new Date(item.modifyDateTime + 'Z');
          const estDate = new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/New_York',
            month: '2-digit', day: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: false
          }).format(utcDate);
          item['draftDate'] = estDate.replace(',', '');
        } else {
          item['draftDate'] = null;
        }
        if(item.createdDateTime) {
          const utcDate = new Date(item.createdDateTime + 'Z');
          const estDate = new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/New_York',
            month: '2-digit', day: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: false
          }).format(utcDate);
          item['publishDate'] = estDate.replace(',', '');
        } else {
          item['publishDate'] = null;
        }
        if(item.scheduledDateTime) {
          const utcDate = new Date(item.scheduledDateTime + 'Z')
          const estDate = new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/New_York',
            month: '2-digit', day: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: false
          }).format(utcDate);
          item['scheduledDate'] = estDate.replace(',', '');
        } else {
          item['scheduledDate'] = null;
        }
      })
      this.navigationArray = res.filter(item => item.menuId !== 'KRC' && item.menuId !== 'KRGC' && !item.subMenuId && item.menuId !== 'collapsable' && item.menuId !== 'basic');
    })
  }
  fetchCMSMenu() {
    this.manageWebsiteService.GetAllCMSMenu(this.showChild).subscribe((res) => {
      this.enableManagePage = false;
      res.forEach((item) => {
        if(item.menuId === 'HM' && item?.draftDeleted) {
          this.enableManagePage = true;
        }
        if(item.modifyDateTime) {
          const utcDate = new Date(item.modifyDateTime + 'Z');
          const estDate = new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/New_York',
            month: '2-digit', day: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: false
          }).format(utcDate);
          item['draftDate'] = estDate.replace(',', '');
        } else {
          item['draftDate'] = null;
        }
        if(item.createdDateTime) {
          const utcDate = new Date(item.createdDateTime + 'Z');
          const estDate = new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/New_York',
            month: '2-digit', day: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: false
          }).format(utcDate);
          item['publishDate'] = estDate.replace(',', '');
        } else {
          item['publishDate'] = null;
        }
        if(item.scheduledDateTime) {
          const utcDate = new Date(item.scheduledDateTime + 'Z')
          const estDate = new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/New_York',
            month: '2-digit', day: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: false
          }).format(utcDate);
          item['scheduledDate'] = estDate.replace(',', '');
        } else {
          item['scheduledDate'] = null;
        }
      })
      this.sideNavArray = res.filter(items => 
        !((items.menuId === '' && items.isPublish) || 
          (items.menuId === 'HM' && items.isPublish) || 
          (items.menuId === 'KRC') || 
          (items.menuId === 'KRGC') || (items.subMenuId))
      );
      this.sideNavSubItemArray = res.filter(item => item.menuId === 'KRC' || item.menuId === 'KRGC' || item.subMenuId);
    })
  }
  closeModel() {
    this.modalReference.close()
  }
  isDateValid(validDateTime: string): boolean {
    const validDate = new Date(validDateTime).toISOString().split("T")[0];
    const currentDate = new Date().toISOString().split("T")[0];
  
    return validDate >= currentDate;
  }
  
  // const validDateTime = "2025-03-01T06:11:46.9983224";
  sharePublishPage(item, content) {
    this.LinkId = item.id;
    this.manageWebsiteService.GetKeyValidation(item.id, 'publish').subscribe((validationResp) => {
      if(!(validationResp?.id && validationResp?.key && validationResp?.validDateTime) || validationResp?.expire) {
        this.manageWebsiteService.SaveOrUpdateShareLink(item.id, 'publish').subscribe((resp) => {
          this.manageWebsiteService.GetKeyValidation(item.id, 'publish').subscribe((newValidationResp) => {
            const baseUrl = window.location.origin;
            const fullUrl = `${baseUrl}/IncentiveWeb/shared-published-page?id=${resp.id}&key=${resp.data}&isd=true`;
            this.sharedUrl = fullUrl;
            if(newValidationResp?.validDateTime) {
              const utcDate = new Date(newValidationResp?.validDateTime + 'Z');
              const estDate = new Intl.DateTimeFormat('en-US', {
                timeZone: 'America/New_York',
                month: '2-digit', day: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit', hour12: false
              }).format(utcDate);
              this.LinkDate = estDate.replace(',', '');
              this.publishLinkDate = estDate.replace(',', '');
            } else {
              this.LinkDate = null;
              this.publishLinkDate = null;
            }
            this.modalReference = this._matDialog.open(content);
          })
        })
      } else {
        const baseUrl = window.location.origin;
        const fullUrl = `${baseUrl}/IncentiveWeb/shared-published-page?id=${validationResp.id}&key=${validationResp.key}&isd=true`;
        this.sharedUrl = fullUrl;
        if(validationResp?.validDateTime) {
          const utcDate = new Date(validationResp?.validDateTime + 'Z');
          const estDate = new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/New_York',
            month: '2-digit', day: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: false
          }).format(utcDate);
          this.LinkDate = estDate.replace(',', '');
          this.publishLinkDate = estDate.replace(',', '');
        } else {
          this.publishLinkDate = null;
          this.LinkDate = null;
        }
        this.modalReference = this._matDialog.open(content);
      }
  
    })
  }
  generateNewLink(content) {
    this.manageWebsiteService.SaveOrUpdateShareLink(this.LinkId, this.showChild ? 'draft' : 'publish').subscribe((resp) => {
      this.manageWebsiteService.GetKeyValidation(this.LinkId, 'draft').subscribe((newValidationResp) => {
        const baseUrl = window.location.origin;
        const fullUrl = `${baseUrl}/IncentiveWeb/shared-published-page?id=${resp.id}&key=${resp.data}&isd=false`;
        this.sharedUrl = fullUrl;
        // this.notificationService.warningTopRight('The link is valid for 15 days unless reset. Resetting will expire it immediately.')
        if(newValidationResp?.validDateTime) {
          const utcDate = new Date(newValidationResp?.validDateTime + 'Z');
          const estDate = new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/New_York',
            month: '2-digit', day: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: false
          }).format(utcDate);
          this.LinkDate = estDate.replace(',', '');
          if(this.showChild) {
            this.shareLinkDate = estDate.replace(',', '');
          } else {
            this.publishLinkDate = estDate.replace(',', '');
          }
          this.modalReference.close()
          this.modalReference = this._matDialog.open(content);
          this.notificationService.successTopRight('New link generated successfully.')
        } else {
          if(this.showChild) {
            this.shareLinkDate = null;
          } else {
            this.publishLinkDate = null;
          }
          this.LinkDate = null;
          this.closeModel();
        }
      })
    })
  }
  shareDraftPage(item, content) {
    this.LinkId = item.id
    this.manageWebsiteService.GetKeyValidation(item.id, 'draft').subscribe((validationResp) => {
      if(!(validationResp?.id && validationResp?.key && validationResp?.validDateTime) || validationResp?.expire) {
        this.manageWebsiteService.SaveOrUpdateShareLink(item.id, 'draft').subscribe((resp) => {
          this.manageWebsiteService.GetKeyValidation(item.id, 'draft').subscribe((newValidationResp) => {
            const baseUrl = window.location.origin;
            const fullUrl = `${baseUrl}/IncentiveWeb/shared-published-page?id=${resp.id}&key=${resp.data}&isd=false`;
            this.sharedUrl = fullUrl;
            // this.notificationService.warningTopRight('The link is valid for 15 days unless reset. Resetting will expire it immediately.')
            if(newValidationResp?.validDateTime) {
              const utcDate = new Date(newValidationResp?.validDateTime + 'Z');
              const estDate = new Intl.DateTimeFormat('en-US', {
                timeZone: 'America/New_York',
                month: '2-digit', day: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit', hour12: false
              }).format(utcDate);
              this.LinkDate = estDate.replace(',', '');
              this.shareLinkDate = estDate.replace(',', '');
            } else {
              this.LinkDate = null;
              this.shareLinkDate = null;
            }
            this.modalReference = this._matDialog.open(content);
          })
        })
      } else {
        const baseUrl = window.location.origin;
        const fullUrl = `${baseUrl}/IncentiveWeb/shared-published-page?id=${validationResp.id}&key=${validationResp.key}&isd=false`;
        this.sharedUrl = fullUrl;
        if(validationResp?.validDateTime) {
          const utcDate = new Date(validationResp?.validDateTime + 'Z');
          const estDate = new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/New_York',
            month: '2-digit', day: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: false
          }).format(utcDate);
          this.LinkDate = estDate.replace(',', '');
          this.shareLinkDate = estDate.replace(',', '');
        } else {
          this.LinkDate = null;
          this.shareLinkDate = null;
        }

        // this.notificationService.warningTopRight('The link is valid for 15 days unless reset. Resetting will expire it immediately.')
        this.modalReference = this._matDialog.open(content);
      }

    })
    // this.manageWebsiteService.SaveOrUpdateShareLink(item.id, 'draft').subscribe((resp) => {
    //   const baseUrl = window.location.origin;
    //   const fullUrl = `${baseUrl}/IncentiveWeb/shared-published-page?id=${resp.id}&key=${resp.data}&isd=false`;
    //   this.sharedUrl = fullUrl;
    //   this.notificationService.warningTopRight('The link is valid for 15 days unless reset. Resetting will expire it immediately.')
    //   this.modalReference = this._matDialog.open(content);
    // })
  }
  copyToHomePage(): void {
    const baseUrl = window.location.origin;
    const fullUrl = `${baseUrl}/IncentiveWeb/dashboards`;
  
    if (navigator.clipboard && window.isSecureContext) {
      // Modern approach using Clipboard API
      navigator.clipboard.writeText(fullUrl).then(() => {
        this.notificationService.successTopRight('Link copied successfully.');
      }).catch(() => {
        this.fallbackCopyToClipboardHomepage(fullUrl);
      });
    } else {
      this.fallbackCopyToClipboardHomepage(fullUrl); // Use fallback for non-HTTPS
    }
  }
  
  private fallbackCopyToClipboardHomepage(text: string): void {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed'; // Prevents scrolling to the bottom
    textArea.style.opacity = '0'; // Hide the textarea
    document.body.appendChild(textArea);
    textArea.select();
    textArea.setSelectionRange(0, textArea.value.length); // Select text
    try {
      document.execCommand('copy'); // Legacy copy method
      this.notificationService.successTopRight('Link copied successfully.');
    } catch (err) {
      this.notificationService.errorTopRight('Unable to copy the link. Please copy it manually.');
    }
    document.body.removeChild(textArea);
  }
  
  copyToClipboard(): void {
    if (navigator.clipboard && window.isSecureContext) {
      // Modern approach using Clipboard API
      navigator.clipboard.writeText(this.sharedUrl).then(() => {
        this.notificationService.successTopRight('Link copied successfully.');
      }).catch(() => {
        this.fallbackCopyToClipboard();
      });
    } else {
      this.fallbackCopyToClipboard(); // Use fallback for non-HTTPS
    }
  }
  
  private fallbackCopyToClipboard(): void {
    const textArea = document.createElement('textarea');
    textArea.value = this.sharedUrl;
    textArea.style.position = 'fixed'; // Prevents scrolling to the bottom
    textArea.style.opacity = '0'; // Hide the textarea
    document.body.appendChild(textArea);
    textArea.select();
    textArea.setSelectionRange(0, textArea.value.length); // Select text
    try {
      document.execCommand('copy'); // Legacy copy method
      this.notificationService.successTopRight('Link copied successfully.');
    } catch (err) {
      this.notificationService.errorTopRight('Unable to copy the link. Please copy it manually.');
    }
    document.body.removeChild(textArea);
  }
  
  addNavigation() {
    this.showMenu = false;
    this.showGroup = false;
    this.showManagePagePopup()
  }
  onMenuTypeChange(event) {
    if (event.value === 'collapsable') {
      this.showChildMenuName = true;
      this.manageNavForm.get('url')?.clearValidators();
      this.manageNavForm.get('url')?.reset();
    } else {
      this.showChildMenuName = false;
      this.manageNavForm.get('url')?.setValidators(Validators.required);
    }
    this.manageNavForm.get('url')?.updateValueAndValidity();
  }
  addNavigationByMenu() {
    this.showGroup = false;
    this.showMenuManagePage = true;
    this.showChildMenuName = false;
    this.manageNavForm = this._formbuilder.group({
      name: [null, Validators.required],
      menuType : ['basic', Validators.required],
      url: [null, Validators.required],
    })
    this.showChildMenuName = false;
    this.manageNavForm.get('url')?.setValidators(Validators.required);
  }
  createSubMenu(item) {
    item['createChild'] = true;
    this.childNavForm = this._formbuilder.group({
      name: [null, Validators.required],
      menuType : ['basic'],
      itemId: item.id,
      url: [null, Validators.required],
    })
  }
  storeState() {
    if (this.currentStateIndex < this.previousStateStogage.length - 1) {
      this.previousStateStogage = this.previousStateStogage.slice(0, this.currentStateIndex);
    }
    if (this.previousStateStogage.length >= 50) {
      this.previousStateStogage.shift();
    }
    this.previousStateStogage.push(this.deepCopy(this.sectionsArray));
    this.currentStateIndex = this.previousStateStogage.length;
  }
  
  undoChanges() {
    if (this.currentStateIndex > 1) {
      this.currentStateIndex -= 1;
      this.sectionsArray = this.deepCopy(this.previousStateStogage[this.currentStateIndex-1]);
      // this.sectionObject = {
      //   isPie: false,
      //   isLine: false,
      //   isbar: false,
      //   academy: false,
      //   all: false,
      //   credit: false,
      //   redemption: false,
      //   article: true,
      //   messages: false,
      //   singlepanel: false,
      //   text: false,
      //   goalTracker: true,
      //   trainingMonth: false,
      // }
      // this.sectionsArray.forEach((item) => {
      //   this.checkSelection(item.type)
      // })
    }
  }
  
  redoChanges() {
    if ((this.currentStateIndex <= this.previousStateStogage.length-1) && this.previousStateStogage.length > 1) {
      this.currentStateIndex += 1;
      this.sectionsArray = this.deepCopy(this.previousStateStogage[this.currentStateIndex-1]);
      // this.sectionObject = {
      //   isPie: false,
      //   isLine: false,
      //   isbar: false,
      //   academy: false,
      //   all: false,
      //   credit: false,
      //   redemption: false,
      //   article: true,
      //   messages: false,
      //   singlepanel: false,
      //   text: false,
      //   goalTracker: true,
      //   trainingMonth: false,
      // }
      // this.sectionsArray.forEach((item) => {
      //   this.checkSelection(item.type)
      // })
    }
  }
  deepCopy(item) {
    return JSON.parse(JSON.stringify(item))
  }
  
}
