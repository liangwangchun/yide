package com.yide.boot.web.core.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yide.boot.web.core.domain.User;
import com.yide.boot.web.core.mapper.UserMapper;
import com.yide.boot.web.core.service.UserService;

/**
 * Description : 用户实现类
 * Company : yide 
 * @author : tyron 
 * @createDate : 2018年4月26日下午5:07:09
 * @version : 1.0
 */
@Service
@Transactional
public class UserServiceImpl  implements UserService{

	@Autowired
	private UserMapper  userMapper; 

	@Override
	public List<User> findUser() {

		return userMapper.findUser();

	}

	@Override
	public User getByUserId(Long userId) {
		return userMapper.selectByPrimaryKey(userId);
	}

}
