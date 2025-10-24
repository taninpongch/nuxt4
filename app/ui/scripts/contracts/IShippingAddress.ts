import { IStreetAddress } from "./IStreetAddress";

export interface IShippingAddress extends IStreetAddress {
    contactNo: string;
    saveContactNo: boolean;
    gpsAddress: GpsAddress;
}

export interface GpsAddress {
    gpsLocation: GpsLocation;
    accuracy: number;
}

export interface GpsLocation {
    lat: number;
    long: number;
}

export class ShippingAddress implements IShippingAddress {
    addressType: string;
    name: string;
    line1: string;
    district: string;
    city: string;
    province: string;
    state: string;
    country: string;
    postalCode: string;
    remark: string;
    saveRemark: boolean;
    contactNo: string;
    saveContactNo: boolean;
    gpsAddress: GpsAddress;

    constructor(
        addressType: string,
        name: string,
        line1: string,
        district: string,
        city: string,
        province: string,
        state: string,
        country: string,
        postalCode: string,
        remark: string,
        saveRemark: boolean,
        contactNo: string,
        saveContactNo: boolean,
        latitude: number,
        longitude: number,
        accuracy: number
    ) {
        this.city = city;
        this.state = state;
        this.contactNo = contactNo;
        this.saveContactNo = saveContactNo;
        this.addressType = addressType;
        this.name = name;
        this.line1 = line1;
        this.district = district;
        this.province = province;
        this.country = country;
        this.postalCode = postalCode;
        this.remark = remark;
        this.saveRemark = saveRemark;
        this.gpsAddress = {gpsLocation: {lat: latitude, long: longitude}, accuracy: accuracy};
    }
}