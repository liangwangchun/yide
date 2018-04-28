package com.yide.boot.web.core.mapper;

import java.util.List;

import com.yide.boot.web.core.domain.User;

/**
 * Description : 
 * Company : yide 
 * @author : tyron 
 * @createDate : 2018年4月26日下午5:08:26
 * @version : 1.0
 */
public interface UserMapper {

	List<User> findUser();
	
	User selectByPrimaryKey(Long userId);
 }
