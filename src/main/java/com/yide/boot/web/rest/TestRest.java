package com.yide.boot.web.rest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class TestRest {


	@GetMapping(value = "/index")
	public String index() {
		System.out.println("come  in ");
		return "index";
	}

	@GetMapping(value = "yd/index2")
	public String index2() {
		System.out.println("come  in index2 ");
		return "yd/index";
	}
	
	
	@GetMapping(value = "/")
	public String defaultIndex() {
		System.out.println("进入首页");
		return "index";
	}
}
