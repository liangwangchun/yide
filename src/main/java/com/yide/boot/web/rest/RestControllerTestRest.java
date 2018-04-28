package com.yide.boot.web.rest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "test2")
public class RestControllerTestRest {


	@GetMapping(value = "/index")
	public String index() {
		System.out.println("come  in ");
		return "index";
	}

}
