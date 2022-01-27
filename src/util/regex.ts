export class Regex {
  /**
   * @param { string } postalCode
   * @returns {boolean} true if the postal code is valid, false otherwise
   */
  static validatePostalCode(postalCode: string): boolean {
    let regex = new RegExp(/^(\d{4})\s*([A-Z]{2})$/i);
    return regex.test(postalCode);
  }

  /**
   * @param { string } address
   * @returns {boolean} true if the address is valid, false otherwise
   */
  static validateAddress(address: string): boolean {
    let regex = new RegExp(/^(\b\D+\b)?\s*(\b.*?\d.*?\b)\s*(\b\D+\b)?$/);
    return regex.test(address);
  }

  /**
   * @param { string } value
   * @returns {boolean} if the value contains only letters and spaces it will return true, false otherwise
   */
  static validateOnlyLettersAndSpaces(value: string) {
    let regex = new RegExp(/^[a-zA-Z\s-]*$/);
    return regex.test(value);
  }

  /**
   * @param { string } coupon
   */
  static validateCoupon(coupon: string): boolean {
    let regex = new RegExp("[0-9]{6}$");
    return regex.test(coupon);
  }

  /**
   * @param { string } campaignID
   */
  static validateCampaign(campaignID: string) {
    let regex = new RegExp("[0-9]");
    return regex.test(campaignID);
  }
}
