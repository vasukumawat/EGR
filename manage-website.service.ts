import { Injectable } from '@angular/core';
import { HttpService } from 'app/shared/HttpService';
import { ExportExcelService } from '../../excel-export-service.service';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageWebsiteService {

  constructor(private _httpClient:HttpService, private exportExcelService:ExportExcelService) { }

  GetAllCMSMenu(flag) {
    return this._httpClient.get('api/CMS/GetAllCMSMenu/'+environment.tentantcode+'?flag='+!flag)
  }
  GetAllCMSContainer(id, flag) {
    return this._httpClient.get('api/CMS/GetAllCMSContainer/'+environment.tentantcode+'/'+id+'?flag='+flag)
  }
  GetAllCMSHeader(flag) {
    return this._httpClient.get('api/CMS/GetAllCMSHeader/'+environment.tentantcode+'?flag='+flag)
  }
  SaveOrUpdateCMSMenu(req) {
    return this._httpClient.post('api/CMS/SaveOrUpdateCMSMenu',req)
  }
  BulkSaveOrUpdateCMSMenu(req, flag) {
    return this._httpClient.post('api/CMS/BulkSaveOrUpdateCMSMenu?flag='+!flag,req)
  }
  SaveOrUpdateCMSContainer(req) {
    return this._httpClient.post('api/CMS/SaveOrUpdateCMSContainer',req)
  }
  DeleteCMSMenu(req, id) {
    return this._httpClient.post('api/CMS/DeleteCMSMenu/'+id+'/'+environment.tentantcode,req)
  }
  DraftDeleteSoft(req) {
    return this._httpClient.post('api/CMS/DraftDeleteSoft/'+environment.tentantcode,req)
  }
  RecallPublishDataInDraft(req, id) {
    return this._httpClient.post('api/CMS/RecallPublishDataInDraft/'+environment.tentantcode+'/'+id,req)
  }
  BulkSaveOrUpdateCMSPublishContainer(id, req) {
    return this._httpClient.post('api/CMS/BulkSaveOrUpdateCMSPublishContainer/'+environment.tentantcode+'/'+id,req)
  }
  SaveOrUpdateCMSHeader(flag,req) {
    return this._httpClient.post('api/CMS/SaveOrUpdateCMSHeader?flag='+flag,req)
  }
  BulkSaveOrUpdateCMSContainer(req, id) {
    return this._httpClient.post('api/CMS/BulkSaveOrUpdateCMSContainer/'+environment.tentantcode+'/'+id,req)
  }
  UploadCMSContainerFile(req) {
    return this._httpClient.post('api/CMS/UploadCMSContainerFile/'+environment.tentantcode,req)
  }
  DeleteCMSContainerFile(id, containerId, req) {
    return this._httpClient.post('api/CMS/DeleteCMSContainerFile/'+environment.tentantcode+'/'+id+'/'+containerId, req)
  }
  UploadCMSTempalteFile(req) {
    return this._httpClient.post('api/CMS/UploadCMSTempalteFile/'+environment.tentantcode, req)
  }
  DeleteCMSTempalteFile(id) {
    return this._httpClient.post('api/CMS/DeleteCMSTempalteFile/'+id, {})
  }
  LikeCMSTempalteFile(req) {
    return this._httpClient.post('api/CMS/LikeCMSTempalteFile', req)
  }
  GetAllCMTempalteFile() {
    return this._httpClient.get('api/CMS/GetAllCMTempalteFile/'+environment.tentantcode)
  }
  CloneCMSMenu(flag) {
    return this._httpClient.get('api/CMS/CloneCMSMenu/'+environment.tentantcode+'?isDelete='+flag)
  }
  CheckSecretKeyValidation(id, key, status) {
    return this._httpClient.get('api/CMS/CheckSecretKeyValidation/'+id+'/'+key+'?Status='+status)
  }
  SaveOrUpdateShareLink(id, status) {
    return this._httpClient.post('api/CMS/SaveOrUpdateShareLink/'+id+'?Status='+status, {})
  }
  ScheduleJob(id, req) {
    return this._httpClient.post('api/CMS/ScheduleJob/'+environment.tentantcode+'/'+id, req)
  }
  DraftDelete(req) {
    return this._httpClient.post('api/CMS/DraftDelete/'+environment.tentantcode, req)
  }
  CancelledScheduleJob(req) {
    return this._httpClient.post('api/CMS/CancelledScheduleJob', req)
  }
  GetKeyValidation(id, status) {
    return this._httpClient.get('api/CMS/GetKeyValidation/'+id+'?status='+status)
  }
  // GetAllCMSContainer(id) {
  //   return this._httpClient.get('api/CMS/GetAllCMSContainer/Flatworld/'+id)
  // }
}
