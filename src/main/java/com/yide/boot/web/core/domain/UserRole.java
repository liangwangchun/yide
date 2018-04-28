/**
 * Description :@TODO
 * <p>Company: yide</p>  
 * @author : tyron 
 *@createDate 2018年4月27日上午10:45:34
 * @version 1.0 
 */

package com.yide.boot.web.core.domain;

/**
 * Description : 角色对象
 * Company : yide 
 * @author : tyron 
 * @createDate : 2018年4月27日上午10:45:34
 * @version : 1.0 
 */

public class UserRole {
	
	private Integer roleType;
	private String roleCode;
	private String roleName;
	
	
	public Integer getRoleType() {
		return roleType;
	}
	public void setRoleType(Integer roleType) {
		this.roleType = roleType;
	}
	public String getRoleCode() {
		return roleCode;
	}
	public void setRoleCode(String roleCode) {
		this.roleCode = roleCode;
	}
	public String getRoleName() {
		return roleName;
	}
	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}
	
	
	
}
