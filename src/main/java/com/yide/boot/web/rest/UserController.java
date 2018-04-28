package com.yide.boot.web.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSON;
import com.yide.boot.web.core.domain.User;
import com.yide.boot.web.core.service.impl.UserServiceImpl;

/**
 * @tip TODO
 * @createTime 2017年7月25日-@上午11:38:52
 * @author tyron
 */
@RestController
public class UserController {

	@Autowired
	private UserServiceImpl   userService;
	
	@RequestMapping(value="findUser")
	public  String findUser(){
		List<User> list = userService.findUser();
		System.out.println(JSON.toJSONString(list));
		return  JSON.toJSONString(list);
	}
}
