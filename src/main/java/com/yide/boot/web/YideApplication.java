package com.yide.boot.web;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.yide.boot.web.core.mapper")
public class YideApplication {

	public static void main(String[] args) {
		SpringApplication.run(YideApplication.class, args);
	}
}
