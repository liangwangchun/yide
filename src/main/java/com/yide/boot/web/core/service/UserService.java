/**
 * Description :@TODO
 * <p>Company: yide</p>  
 * @author : tyron 
 *@createDate 2018年4月26日下午5:02:48
 * @version 1.0 
 */

package com.yide.boot.web.core.service;

import java.util.List;

import com.yide.boot.web.core.domain.User;

/**
 * Description : 用户接口
 * Company : yide 
 * @author : tyron 
 * @createDate : 2018年4月26日下午5:02:48
 * @version : 1.0 
 */

public interface UserService {


	List<User> findUser();

	/**
	 * @param username
	 * @return
	 */
	User getByUserId(Long  userId);
	
	
}
