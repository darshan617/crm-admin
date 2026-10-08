
import React from "react";
import styles from './EditDetailForm.module.css'
const EditDetailForm = () => {


  return (

      <div className={styles.creditModalBox}>
        <h2>Add / Edit Lead Details</h2>

        <form
          method="POST"
          action="https://superadmin.tizzygroup.com/crm/leads/70/update"
          className="common-form"
          id="leadDetailsForm"
          noValidate
        >
          <input
            type="hidden"
            name="_token"
            value="WW2Yc8aGHganqT0MoQtZEFariu0DTM7CjtaZh8YE"
            autoComplete="off"
          />

          <div className={styles.formGrid}>
            <div className="form-group">
              <label>
                Name <span>*</span>
              </label>

              <div className="phone-group name-title-row">
                <select
                  name="salutation"
                  className="form-control phone-code-select title-select"
                  required
                  defaultValue="Mr"
                >
                  <option value="">Title</option>
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Ms">Ms</option>
                </select>

                <input
                  type="text"
                  name="name"
                  defaultValue="Darshan B"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Designation</label>

              <select name="designation" defaultValue="Accounts">
                <option value="">Select Designation</option>
                <option value="Accounts">Accounts</option>
                <option value="Director">Director</option>
                <option value="IT Head">IT Head</option>
                <option value="Manager">Manager</option>
                <option value="Owner">Owner</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                Email <span>*</span>
              </label>

              <input
                type="email"
                name="email"
                defaultValue="darshan1@goyalinfotech.com"
                required
              />
            </div>

            <div className="form-group">
              <label>
                Mobile <span>*</span>
              </label>

              <div className="phone-group">
                <select
                  name="mobile_code"
                  className="form-control phone-code-select"
                  defaultValue="91"
                >
                  <option value="91">+91 India</option>
                  <option value="93">+93 Afghanistan</option>
                  <option value="355">+355 Albania</option>
                  <option value="213">+213 Algeria</option>
                  <option value="376">+376 Andorra</option>
                  <option value="244">+244 Angola</option>
                  <option value="54">+54 Argentina</option>
                  <option value="374">+374 Armenia</option>
                  <option value="973">+973 Bahrain</option>
                  <option value="880">+880 Bangladesh</option>
                  <option value="375">+375 Belarus</option>
                  <option value="32">+32 Belgium</option>
                  <option value="501">+501 Belize</option>
                  <option value="229">+229 Benin</option>
                  <option value="975">+975 Bhutan</option>
                  <option value="591">+591 Bolivia</option>
                  <option value="387">+387 Bosnia</option>
                  <option value="267">+267 Botswana</option>
                  <option value="55">+55 Brazil</option>
                  <option value="673">+673 Brunei</option>
                  <option value="359">+359 Bulgaria</option>
                  <option value="226">+226 Burkina Faso</option>
                  <option value="257">+257 Burundi</option>
                  <option value="855">+855 Cambodia</option>
                  <option value="237">+237 Cameroon</option>
                  <option value="1">+1 USA / Canada</option>
                  <option value="238">+238 Cape Verde</option>
                  <option value="236">+236 Central African Republic</option>
                  <option value="235">+235 Chad</option>
                  <option value="56">+56 Chile</option>
                  <option value="86">+86 China</option>
                  <option value="57">+57 Colombia</option>
                  <option value="269">+269 Comoros</option>
                  <option value="242">+242 Congo</option>
                  <option value="506">+506 Costa Rica</option>
                  <option value="385">+385 Croatia</option>
                  <option value="53">+53 Cuba</option>
                  <option value="357">+357 Cyprus</option>
                  <option value="420">+420 Czech Republic</option>
                  <option value="45">+45 Denmark</option>
                  <option value="253">+253 Djibouti</option>
                  <option value="593">+593 Ecuador</option>
                  <option value="20">+20 Egypt</option>
                  <option value="503">+503 El Salvador</option>
                  <option value="240">+240 Equatorial Guinea</option>
                  <option value="291">+291 Eritrea</option>
                  <option value="372">+372 Estonia</option>
                  <option value="251">+251 Ethiopia</option>
                  <option value="679">+679 Fiji</option>
                  <option value="358">+358 Finland</option>
                  <option value="33">+33 France</option>
                  <option value="241">+241 Gabon</option>
                  <option value="220">+220 Gambia</option>
                  <option value="995">+995 Georgia</option>
                  <option value="49">+49 Germany</option>
                  <option value="233">+233 Ghana</option>
                  <option value="30">+30 Greece</option>
                  <option value="502">+502 Guatemala</option>
                  <option value="224">+224 Guinea</option>
                  <option value="245">+245 Guinea-Bissau</option>
                  <option value="592">+592 Guyana</option>
                  <option value="509">+509 Haiti</option>
                  <option value="504">+504 Honduras</option>
                  <option value="852">+852 Hong Kong</option>
                  <option value="36">+36 Hungary</option>
                  <option value="354">+354 Iceland</option>
                  <option value="62">+62 Indonesia</option>
                  <option value="98">+98 Iran</option>
                  <option value="964">+964 Iraq</option>
                  <option value="353">+353 Ireland</option>
                  <option value="972">+972 Israel</option>
                  <option value="39">+39 Italy</option>
                  <option value="225">+225 Ivory Coast</option>
                  <option value="81">+81 Japan</option>
                  <option value="962">+962 Jordan</option>
                  <option value="7">+7 Kazakhstan / Russia</option>
                  <option value="254">+254 Kenya</option>
                  <option value="686">+686 Kiribati</option>
                  <option value="965">+965 Kuwait</option>
                  <option value="996">+996 Kyrgyzstan</option>
                  <option value="856">+856 Laos</option>
                  <option value="371">+371 Latvia</option>
                  <option value="961">+961 Lebanon</option>
                  <option value="266">+266 Lesotho</option>
                  <option value="231">+231 Liberia</option>
                  <option value="218">+218 Libya</option>
                  <option value="423">+423 Liechtenstein</option>
                  <option value="370">+370 Lithuania</option>
                  <option value="352">+352 Luxembourg</option>
                  <option value="853">+853 Macau</option>
                  <option value="389">+389 Macedonia</option>
                  <option value="261">+261 Madagascar</option>
                  <option value="265">+265 Malawi</option>
                  <option value="60">+60 Malaysia</option>
                  <option value="960">+960 Maldives</option>
                  <option value="223">+223 Mali</option>
                  <option value="356">+356 Malta</option>
                  <option value="222">+222 Mauritania</option>
                  <option value="230">+230 Mauritius</option>
                  <option value="52">+52 Mexico</option>
                  <option value="373">+373 Moldova</option>
                  <option value="377">+377 Monaco</option>
                  <option value="976">+976 Mongolia</option>
                  <option value="382">+382 Montenegro</option>
                  <option value="212">+212 Morocco</option>
                  <option value="258">+258 Mozambique</option>
                  <option value="95">+95 Myanmar</option>
                  <option value="264">+264 Namibia</option>
                  <option value="977">+977 Nepal</option>
                  <option value="31">+31 Netherlands</option>
                  <option value="64">+64 New Zealand</option>
                  <option value="505">+505 Nicaragua</option>
                  <option value="227">+227 Niger</option>
                  <option value="234">+234 Nigeria</option>
                  <option value="850">+850 North Korea</option>
                  <option value="47">+47 Norway</option>
                  <option value="968">+968 Oman</option>
                  <option value="92">+92 Pakistan</option>
                  <option value="970">+970 Palestine</option>
                  <option value="507">+507 Panama</option>
                  <option value="675">+675 Papua New Guinea</option>
                  <option value="595">+595 Paraguay</option>
                  <option value="51">+51 Peru</option>
                  <option value="63">+63 Philippines</option>
                  <option value="48">+48 Poland</option>
                  <option value="351">+351 Portugal</option>
                  <option value="974">+974 Qatar</option>
                  <option value="40">+40 Romania</option>
                  <option value="250">+250 Rwanda</option>
                  <option value="966">+966 Saudi Arabia</option>
                  <option value="221">+221 Senegal</option>
                  <option value="381">+381 Serbia</option>
                  <option value="248">+248 Seychelles</option>
                  <option value="232">+232 Sierra Leone</option>
                  <option value="65">+65 Singapore</option>
                  <option value="421">+421 Slovakia</option>
                  <option value="386">+386 Slovenia</option>
                  <option value="252">+252 Somalia</option>
                  <option value="27">+27 South Africa</option>
                  <option value="82">+82 South Korea</option>
                  <option value="211">+211 South Sudan</option>
                  <option value="34">+34 Spain</option>
                  <option value="94">+94 Sri Lanka</option>
                  <option value="249">+249 Sudan</option>
                  <option value="597">+597 Suriname</option>
                  <option value="268">+268 Swaziland</option>
                  <option value="46">+46 Sweden</option>
                  <option value="41">+41 Switzerland</option>
                  <option value="963">+963 Syria</option>
                  <option value="886">+886 Taiwan</option>
                  <option value="992">+992 Tajikistan</option>
                  <option value="255">+255 Tanzania</option>
                  <option value="66">+66 Thailand</option>
                  <option value="228">+228 Togo</option>
                  <option value="676">+676 Tonga</option>
                  <option value="216">+216 Tunisia</option>
                  <option value="90">+90 Turkey</option>
                  <option value="993">+993 Turkmenistan</option>
                  <option value="256">+256 Uganda</option>
                  <option value="380">+380 Ukraine</option>
                  <option value="971">+971 UAE</option>
                  <option value="44">+44 United Kingdom</option>
                  <option value="598">+598 Uruguay</option>
                  <option value="998">+998 Uzbekistan</option>
                  <option value="678">+678 Vanuatu</option>
                  <option value="58">+58 Venezuela</option>
                  <option value="84">+84 Vietnam</option>
                  <option value="967">+967 Yemen</option>
                  <option value="260">+260 Zambia</option>
                  <option value="263">+263 Zimbabwe</option>
                </select>

                <input
                  type="tel"
                  name="mobile"
                  defaultValue="9658745858"
                  required
                  inputMode="numeric"
                  maxLength="15"
                  pattern="[0-9]{6,15}"
                  className="js-mobile-digits"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Company Name</label>
              <input
                type="text"
                name="company_name"
                defaultValue="CENTRAL WARE HOUSING CORP.LTD."
              />
            </div>

            <div className="form-group">
              <label>Business</label>
              <select name="business_type" defaultValue="existing">
                <option value="new">New Business</option>
                <option value="existing">Existing Business</option>
              </select>
            </div>

            <div className="form-group">
              <label>Industry</label>
              <input
                type="text"
                name="industry"
                defaultValue="CORPORATION"
                placeholder="Filled from GSTIN"
              />
            </div>

            <div className="form-group">
              <label>No. of Employees</label>
              <input
                type="number"
                name="no_of_employees"
                min="0"
                defaultValue="22"
              />
            </div>

            <div className="form-group">
              <label>GSTIN</label>

              <input
                type="text"
                name="gstin"
                id="editGstin"
                defaultValue="24AAACC1206D1ZM"
                maxLength="15"
              />

              <div
                id="editGstStatus"
                style={{
                  fontSize: "13px",
                  marginTop: "6px",
                  fontWeight: 600,
                }}
              ></div>
            </div>

            <div className="form-group">
              <label>Assigned To</label>

              <select name="assigned_to" defaultValue="Darshan Bane">
                <option value="">Select Employee</option>
                <option value="Darshan Bane">Darshan Bane</option>
                <option value="Janvi Singh">Janvi Singh</option>
                <option value="Pratik V">Pratik V</option>
              </select>
            </div>

            <div className="form-group">
              <label>Lead Priority</label>

              <select name="lead_category" defaultValue="Hot">
                <option value="">Select Priority</option>
                <option value="Cold">Cold</option>
                <option value="Hot">Hot</option>
                <option value="Normal">Normal</option>
                <option value="Warm">Warm</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                Lead Status <span>*</span>
              </label>

              <select name="lead_status" required defaultValue="Contacted">
                <option value="">Select Status</option>
                <option value="Contacted">Contacted</option>
                <option value="Lost">Lost</option>
                <option value="Negotiation">Negotiation</option>
                <option value="New">New</option>
                <option value="Nurturing">Nurturing</option>
                <option value="Qualified">Qualified</option>
                <option value="Quote Send">Quote Send</option>
                <option value="Won">Won</option>
              </select>
            </div>

            <div className="form-group">
              <label>Lead Bifurcation</label>

              <select name="lead_bifurcation" defaultValue="B2B">
                <option value="">Select Bifurcation</option>
                <option value="B2B">B2B</option>
                <option value="B2C">B2C</option>
              </select>
            </div>

            <div className="form-group">
              <label>Lead Source</label>

              <select name="lead_source" defaultValue="Website">
                <option value="">Select Source</option>
                <option value="Email">Email</option>
                <option value="Exhibition">Exhibition</option>
                <option value="Google Ads">Google Ads</option>
                <option value="Instagram">Instagram</option>
                <option value="JD">JD</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Referral">Referral</option>
                <option value="Tele Caller">Tele Caller</option>
                <option value="Website">Website</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Mailing Address</label>

              <input
                type="text"
                name="mailing_address"
                defaultValue="CENTRAL WAREHOUSING CORPORATION, MAHALAXMI CHAR RASTA, PALDI, Ahmedabad, Gujarat, 380007"
              />
            </div>

            <div className="form-group">
              <label>Country</label>

              <select name="country" defaultValue="India">
                <option value="">Select Country</option>
                <option value="India">India</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="United Arab Emirates">
                  United Arab Emirates
                </option>
              </select>
            </div>

            <div className="form-group">
              <label>State</label>

              <input type="text" name="state" defaultValue="Delhi" />
            </div>

            <div className="form-group">
              <label>City</label>

              <input type="text" name="city" defaultValue="" />
            </div>

            <div className="form-group">
              <label>Pincode</label>

              <input type="text" name="pincode" defaultValue="380007" />
            </div>

            <div className="form-group">
              <label>Domain option</label>

              <select
                name="domain_type"
                id="editDomainType"
                defaultValue="existing"
              >
                <option value="">No domain</option>
                <option value="existing">Already have domain</option>
                <option value="new">Need new domain</option>
              </select>
            </div>

            <div
              className="form-group edit-domain-name domain-check-group"
              style={{}}
            >
              <label>Domain Name</label>

              <div className="domain-check-row">
                <input
                  type="text"
                  name="domain"
                  id="editDomainName"
                  defaultValue="dar.com"
                  placeholder="example.com"
                />

                <button
                  type="button"
                  className="add-plan-btn domain-check-btn edit-domain-check"
                  id="editCheckDomainBtn"
                  style={{ display: "none" }}
                >
                  Check Availability
                </button>
              </div>

              <div
                id="editDomainCheckStatus"
                className="form-hint domain-check-status"
              ></div>

              <div id="editDomainHaveHint" className="form-hint"></div>
            </div>

            <div
              className="form-group edit-domain-have"
              style={{ display: "flex" }}
            >
              <label>Renewal Date</label>

              <div className="date-input">
                <input
                  type="date"
                  name="domain_renewal_date"
                  id="editDomainRenewal"
                  defaultValue="2026-10-06"
                />
              </div>
            </div>

            <div
              className="form-group edit-domain-new"
              style={{ display: "none" }}
            >
              <label>Period</label>

              <select name="domain_period" defaultValue="">
                <option value="">Select Period</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Half Yearly">Half Yearly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>

            <div
              className="form-group edit-domain-new"
              style={{ display: "none" }}
            >
              <label>Rate</label>

              <input
                type="number"
                name="domain_rate"
                min="0"
                step="0.01"
                defaultValue=""
              />
            </div>

            <div
              className="form-group edit-domain-new"
              style={{ display: "none" }}
            >
              <label>SAC</label>

              <input type="text" name="sac" defaultValue="" />
            </div>

            <div
              className="form-group edit-domain-new"
              style={{ display: "none" }}
            >
              <label>Domain Start</label>

              <input type="date" name="domain_start" defaultValue="" />
            </div>

            <div
              className="form-group edit-domain-new"
              style={{ display: "none" }}
            >
              <label>Domain End</label>

              <input type="date" name="domain_end" defaultValue="" />
            </div>
          </div>

          <div className={styles.submitWrap}>
            <button type="submit" className={styles.submitBtn}>
              Save Details
            </button>
          </div>
        </form>
      </div>

  );
};

export default EditDetailForm;
