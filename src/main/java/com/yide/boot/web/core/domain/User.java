package com.yide.boot.web.core.domain;

import java.util.Date;


public class User  extends BaseDomain{
	
	private static final long serialVersionUID = 2051820332325062403L;
	
	private Long userId;
	
	private String userCode;
	
	private String userName;
	
	private String userFullName;
	
	private String userPassword;
	
	private String userPhone;
	
	private Short userType;
	
	private Long createUserId;
	
	private Long modifyUserId;
	
	private Date modifyUserTime;
	
	private Short userStatus;
	
	private Short userDepartmentId;
	
	private String userEmail;
	
	private String userRemark;
	
	private String userTel;
	
	private Long userStoreId;
	
	private Long userMemberId;

	
	
	
	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getUserCode() {
		return userCode;
	}

	public void setUserCode(String userCode) {
		this.userCode = userCode;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getUserFullName() {
		return userFullName;
	}

	public void setUserFullName(String userFullName) {
		this.userFullName = userFullName;
	}

	public String getUserPassword() {
		return userPassword;
	}

	public void setUserPassword(String userPassword) {
		this.userPassword = userPassword;
	}

	public String getUserPhone() {
		return userPhone;
	}

	public void setUserPhone(String userPhone) {
		this.userPhone = userPhone;
	}

	public Short getUserType() {
		return userType;
	}

	public void setUserType(Short userType) {
		this.userType = userType;
	}

	public Long getCreateUserId() {
		return createUserId;
	}

	public void setCreateUserId(Long createUserId) {
		this.createUserId = createUserId;
	}

	public Long getModifyUserId() {
		return modifyUserId;
	}

	public void setModifyUserId(Long modifyUserId) {
		this.modifyUserId = modifyUserId;
	}

	public Date getModifyUserTime() {
		return modifyUserTime;
	}

	public void setModifyUserTime(Date modifyUserTime) {
		this.modifyUserTime = modifyUserTime;
	}

	public Short getUserStatus() {
		return userStatus;
	}

	public void setUserStatus(Short userStatus) {
		this.userStatus = userStatus;
	}

	public Short getUserDepartmentId() {
		return userDepartmentId;
	}

	public void setUserDepartmentId(Short userDepartmentId) {
		this.userDepartmentId = userDepartmentId;
	}

	public String getUserEmail() {
		return userEmail;
	}

	public void setUserEmail(String userEmail) {
		this.userEmail = userEmail;
	}

	public String getUserRemark() {
		return userRemark;
	}

	public void setUserRemark(String userRemark) {
		this.userRemark = userRemark;
	}

	public String getUserTel() {
		return userTel;
	}

	public void setUserTel(String userTel) {
		this.userTel = userTel;
	}

	public Long getUserStoreId() {
		return userStoreId;
	}

	public void setUserStoreId(Long userStoreId) {
		this.userStoreId = userStoreId;
	}

	public Long getUserMemberId() {
		return userMemberId;
	}

	public void setUserMemberId(Long userMemberId) {
		this.userMemberId = userMemberId;
	}

	
	
	
	
}
